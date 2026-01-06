import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Seasons() {
  const [standings, setStandings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seasonsResponse, standingsResponse, ownersResponse] = await Promise.all([
          apiService.getSeasons(),
          apiService.getAllStandings(),
          apiService.getOwners(),
        ]);
        setYears(seasonsResponse.data.years);
        setStandings(standingsResponse.data);
        setOwners(ownersResponse.data);
        setSelectedYear(seasonsResponse.data.latest_season);
        if (ownersResponse.data.length > 0) {
          setSelectedOwner(ownersResponse.data[0].owner);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const filteredStandings = standings.filter(s => s.year === selectedYear);

  const renderTrophy = (finalStanding) => {
    if (finalStanding === 1) {
      return <span className="text-2xl" title="Champion">🥇</span>;
    } else if (finalStanding === 2) {
      return <span className="text-2xl" title="Runner-up">🥈</span>;
    } else if (finalStanding === 3) {
      return <span className="text-2xl" title="3rd Place">🥉</span>;
    }
    return <span className="text-white/30">-</span>;
  };

  return (
    <div className="space-y-6">
      {/* Owner Wins/Losses Over Time */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 p-1">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6 flex items-center space-x-3">
            <span>📈</span>
            <span>Wins & Losses Over Time</span>
          </h2>

          {/* Owner Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-400 mb-2 uppercase tracking-wider">Select Owner</label>
            <select
              value={selectedOwner || ''}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full md:w-64 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {owners.map(owner => (
                <option key={owner.owner} value={owner.owner}>{owner.owner}</option>
              ))}
            </select>
          </div>

          {/* Chart */}
          {(() => {
            // Prepare data for selected owner
            const ownerSeasonData = standings
              .filter(s => s.owner === selectedOwner)
              .sort((a, b) => a.year - b.year)
              .map(s => ({
                year: s.year,
                wins: s.wins,
                losses: s.losses,
                standing: s.standing,
                finalStanding: s.final_standing,
                playoffFinish: s.final_standing === 1 ? '🥇 Champion' :
                               s.final_standing === 2 ? '🥈 Runner-up' :
                               s.final_standing === 3 ? '🥉 3rd Place' :
                               s.playoff_seed ? 'Made playoffs (outside top 3)' : 'Missed playoffs'
              }));

            // Custom tooltip
            const CustomTooltip = ({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800/95 border border-white/20 rounded-lg p-4 shadow-xl">
                    <p className="text-white font-bold text-lg mb-2">{data.year} Season</p>
                    <p className="text-green-400 font-semibold">Wins: {data.wins}</p>
                    <p className="text-red-400 font-semibold">Losses: {data.losses}</p>
                    <p className="text-blue-400 mt-2">Regular Season: #{data.standing}</p>
                    <p className="text-yellow-400">{data.playoffFinish}</p>
                  </div>
                );
              }
              return null;
            };

            return (
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ownerSeasonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="year"
                      stroke="#ffffff80"
                      style={{ fontSize: '14px', fontWeight: 'bold' }}
                    />
                    <YAxis
                      stroke="#ffffff80"
                      style={{ fontSize: '14px', fontWeight: 'bold' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="wins"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Wins"
                      dot={{ fill: '#10b981', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="losses"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Losses"
                      dot={{ fill: '#ef4444', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-1">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 flex items-center space-x-3">
            <span>📅</span>
            <span>Season Standings</span>
          </h1>

          {/* Year Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wider">Select Season</label>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full md:w-64 px-4 py-3 bg-slate-800/50 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            >
              {years.map(year => (
                <option key={year} value={year}>{year} Season</option>
              ))}
            </select>
          </div>

          {/* Standings Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Record</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Points For</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Points Against</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Playoff Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStandings.map(team => (
                  <tr key={`${team.year}-${team.team_name}`} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-white/70">{team.standing}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">
                      {team.team_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/70">
                      {team.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-400 font-semibold">
                      {team.wins}-{team.losses}{team.ties > 0 && `-${team.ties}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">
                      {team.points_for.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-400 font-semibold">
                      {team.points_against.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderTrophy(team.final_standing)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seasons;
