
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RiskScore {
  user_id: string;
  score: number;
  factors: {
    transactionVolume: number;
    transactionFrequency: number;
    geographicalRisk: number;
    accountAge: number;
    kycStatus: number;
  };
  calculated_at: string;
}

const RiskScoringSystem = () => {
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRiskScores();
  }, []);

  const fetchRiskScores = async () => {
    setLoading(true);
    try {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, created_at, kyc_status');

      if (usersError) throw usersError;

      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('user_id, amount, created_at, status');

      if (txError) throw txError;

      // Calculate risk scores for each user
      const calculatedScores = users.map(user => {
        const userTransactions = transactions.filter(tx => tx.user_id === user.user_id);
        const totalVolume = userTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
        const completedTx = userTransactions.filter(tx => tx.status === 'completed').length;
        const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

        // Risk factors (0-100 scale)
        const factors = {
          transactionVolume: Math.min(totalVolume / 1000, 100), // Higher volume = higher risk
          transactionFrequency: Math.min(completedTx * 5, 100), // More transactions = higher risk
          geographicalRisk: Math.random() * 30, // Simulated geographical risk
          accountAge: Math.max(100 - accountAge, 0), // Newer accounts = higher risk
          kycStatus: user.kyc_status === 'approved' ? 0 : 50 // Unverified = higher risk
        };

        // Calculate overall risk score (weighted average)
        const score = Math.round(
          (factors.transactionVolume * 0.3 +
           factors.transactionFrequency * 0.25 +
           factors.geographicalRisk * 0.2 +
           factors.accountAge * 0.15 +
           factors.kycStatus * 0.1)
        );

        return {
          user_id: user.user_id,
          score: Math.min(score, 100),
          factors,
          calculated_at: new Date().toISOString()
        };
      });

      setRiskScores(calculatedScores.sort((a, b) => b.score - a.score));
      
      // Store risk scores in database
      for (const riskScore of calculatedScores) {
        await supabase
          .from('risk_scores')
          .upsert({
            user_id: riskScore.user_id,
            score: riskScore.score,
            factors: riskScore.factors,
            calculated_at: riskScore.calculated_at,
            updated_by: user?.id
          });
      }

      toast({
        title: "Risk Scores Updated",
        description: "All user risk scores have been recalculated.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      console.error('Error calculating risk scores:', error);
      toast({
        title: "Error",
        description: "Failed to calculate risk scores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'bg-red-600' };
    if (score >= 60) return { level: 'High', color: 'bg-orange-600' };
    if (score >= 40) return { level: 'Medium', color: 'bg-yellow-600' };
    if (score >= 20) return { level: 'Low', color: 'bg-blue-600' };
    return { level: 'Minimal', color: 'bg-green-600' };
  };

  const filteredScores = riskScores.filter(score =>
    score.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highRiskUsers = riskScores.filter(score => score.score >= 60).length;
  const averageRiskScore = riskScores.length > 0 
    ? Math.round(riskScores.reduce((sum, score) => sum + score.score, 0) / riskScores.length)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Risk Scoring Dashboard</CardTitle>
          <Button
            onClick={fetchRiskScores}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Recalculate Scores
          </Button>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{riskScores.length}</div>
              <div className="text-sm text-blue-700">Total Users</div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{highRiskUsers}</div>
              <div className="text-sm text-red-700">High Risk Users</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{averageRiskScore}</div>
              <div className="text-sm text-orange-700">Average Risk Score</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {((riskScores.length - highRiskUsers) / riskScores.length * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-green-700">Low Risk Users</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Risk Scores List */}
          <div className="space-y-4">
            {filteredScores.map((riskScore) => {
              const riskLevel = getRiskLevel(riskScore.score);
              return (
                <div key={riskScore.user_id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">User: {riskScore.user_id.slice(0, 20)}...</div>
                      <div className="text-sm text-gray-600">
                        Last calculated: {new Date(riskScore.calculated_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{riskScore.score}</div>
                      <Badge className={`${riskLevel.color} text-white`}>
                        {riskLevel.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Risk Factors Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Transaction Volume</div>
                      <div className="font-medium">{Math.round(riskScore.factors.transactionVolume)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Frequency</div>
                      <div className="font-medium">{Math.round(riskScore.factors.transactionFrequency)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Geography</div>
                      <div className="font-medium">{Math.round(riskScore.factors.geographicalRisk)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Account Age</div>
                      <div className="font-medium">{Math.round(riskScore.factors.accountAge)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">KYC Status</div>
                      <div className="font-medium">{Math.round(riskScore.factors.kycStatus)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredScores.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <Shield size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No risk scores found</p>
              <p className="text-sm">Click "Recalculate Scores" to generate risk assessments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskScoringSystem;
