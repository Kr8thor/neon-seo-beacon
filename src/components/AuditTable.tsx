
import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Calendar, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search,
  Eye,
  RotateCcw,
  Trash2,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface AuditData {
  id: string;
  url: string;
  score: number;
  status: 'completed' | 'processing' | 'failed';
  date: Date;
  issues: {
    critical: number;
    warnings: number;
    recommendations: number;
  };
  duration?: number;
  favicon?: string;
}

interface AuditTableProps {
  audits: AuditData[];
  onView?: (audit: AuditData) => void;
  onReanalyze?: (audit: AuditData) => void;
  onDelete?: (audit: AuditData) => void;
  loading?: boolean;
}

type SortField = 'url' | 'score' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-green-400 bg-green-500/20';
  if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
  if (score >= 40) return 'text-orange-400 bg-orange-500/20';
  return 'text-red-400 bg-red-500/20';
};

const getStatusConfig = (status: AuditData['status']) => {
  switch (status) {
    case 'completed':
      return { color: 'text-green-400 bg-green-500/20', label: 'Completed' };
    case 'processing':
      return { color: 'text-blue-400 bg-blue-500/20', label: 'Processing' };
    case 'failed':
      return { color: 'text-red-400 bg-red-500/20', label: 'Failed' };
  }
};

export const AuditTable: React.FC<AuditTableProps> = ({
  audits,
  onView,
  onReanalyze,
  onDelete,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAndSortedAudits = useMemo(() => {
    let filtered = audits.filter(audit => {
      const matchesSearch = audit.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [audits, searchTerm, sortField, sortDirection, statusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/30">
              <TableHead 
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('url')}
              >
                <div className="flex items-center space-x-2">
                  <span>Website</span>
                  {getSortIcon('url')}
                </div>
              </TableHead>
              <TableHead 
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center space-x-2">
                  <span>Score</span>
                  {getSortIcon('score')}
                </div>
              </TableHead>
              <TableHead 
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead>
                <span className="text-gray-300">Issues</span>
              </TableHead>
              <TableHead 
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-2">
                  <span>Date</span>
                  {getSortIcon('date')}
                </div>
              </TableHead>
              <TableHead>
                <span className="text-gray-300">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedAudits.map((audit) => {
              const statusConfig = getStatusConfig(audit.status);
              return (
                <TableRow 
                  key={audit.id} 
                  className="border-gray-700 hover:bg-gray-800/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{audit.url}</div>
                        {audit.duration && (
                          <div className="text-xs text-gray-400">
                            Analyzed in {audit.duration}s
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {audit.status === 'completed' ? (
                      <Badge className={`${getScoreColor(audit.score)} border-none font-semibold`}>
                        {audit.score}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${statusConfig.color} border-none`}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {audit.status === 'completed' ? (
                      <div className="flex space-x-2 text-xs">
                        <span className="text-red-400">{audit.issues.critical}</span>
                        <span className="text-yellow-400">{audit.issues.warnings}</span>
                        <span className="text-blue-400">{audit.issues.recommendations}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDistanceToNow(audit.date, { addSuffix: true })}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(audit)}
                        className="text-gray-400 hover:text-white h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {audit.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReanalyze?.(audit)}
                          className="text-gray-400 hover:text-white h-8 w-8 p-0"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(audit)}
                        className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {filteredAndSortedAudits.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No audits found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
