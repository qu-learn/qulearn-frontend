import type React from "react"
import { Trophy, Medal, Star, TrendingUp } from "lucide-react"
import { useGetAchievementsQuery, useGetMyDashboardQuery } from "../../utils/api"
import Footer from "../../components/Footer"

const Achievements: React.FC = () => {
  const { data: achievementsData, isLoading: achievementsLoading } = useGetAchievementsQuery()
  const { data: dashboardData, isLoading: dashboardLoading } = useGetMyDashboardQuery()

  if (achievementsLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (!achievementsData || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Achievements</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-700 mb-2">Achievements & Progress</h1>
        <p className="text-cyan-600">Track your quantum computing learning journey</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-cyan-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.points.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-200  rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.badges.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-200  rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.learningStreak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-200  rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Medal className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.achievements.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earned Badges */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-cyan-700 mb-6">Your Badges</h2>
          {dashboardData.badges.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No badges earned yet</p>
              <p className="text-sm text-gray-500">Complete courses and quizzes to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {dashboardData.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-cyan-600 to-indigo-50 p-4 rounded-lg border border-cyan-600"
                >
                  <img src={badge.iconUrl || "/placeholder.svg"} alt={badge.name} className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 text-center mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{badge.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-cyan-700 mb-6">Recent Achievements</h2>
          {dashboardData.achievements.length === 0 ? (
            <div className="text-center py-8">
              <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No achievements yet</p>
              <p className="text-sm text-gray-500">Start learning to unlock achievements!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.achievements.slice(0, 5).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={achievement.badge.iconUrl || "/placeholder.svg"}
                    alt={achievement.badge.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.badge.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.badge.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Earned {new Date(achievement.achievedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-yellow-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-cyan-700 mb-6">Learning Milestones</h2>
        {achievementsData.milestones.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No milestones available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievementsData.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center p-4 bg-blue-200 rounded-lg border border-cyan-100">
                <div className="w-8 h-8 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  {index + 1}
                </div>
                <p className="text-gray-900">{milestone}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-cyan-700 mb-6">Leaderboard</h2>
        {achievementsData.leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Leaderboard not available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {achievementsData.leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      entry.rank === 1
                        ? "bg-amber-500"
                        : entry.rank === 2
                          ? "bg-zinc-400"
                          : entry.rank === 3
                            ? "bg-amber-700"
                            : "bg-cyan-600"
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <span className="font-medium text-gray-900">{entry.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">{entry.points.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      
      <Footer />
    </>
  )
}

export default Achievements
