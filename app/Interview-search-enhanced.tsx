"use client"

import { useState, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart2,
  Briefcase,
  Building2,
  Calendar,
  Loader2,
  PieChart,
  Search,
  User,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  Filter,
  SortDesc,
  Star,
  Sparkles,
  Code,
  Database,
  Layers,
  Brain,
  MessageSquare,
  Users,
  Lightbulb,
} from "lucide-react"

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

type Question = {
  text: string
  topic: string
  roundType: string
  difficulty: string
  frequency?: number
  recency?: string
}

type SearchForm = {
  company: string
  role: string
  position: string
  year: string
}

type SearchResult = {
  totalResults: number
  totalQuestions: number
  questions: Question[]
}

const companies = [
  { value: "Google", label: "Google", icon: "🔍", color: "from-blue-500 to-green-500" },
  { value: "Microsoft", label: "Microsoft", icon: "🪟", color: "from-blue-600 to-cyan-500" },
  { value: "amazon", label: "Amazon", icon: "📦", color: "from-orange-500 to-yellow-500" },
  { value: "meta", label: "Meta", icon: "👥", color: "from-blue-500 to-purple-600" },
  { value: "apple", label: "Apple", icon: "🍎", color: "from-gray-700 to-gray-900" },
]

const roles = [
  { value: "Software Engineer", label: "Software Engineer", icon: "💻" },
  { value: "associate-software-engineer", label: "Associate Software Engineer", icon: "🔧" },
  { value: "frontend-engineer", label: "Frontend Engineer", icon: "🎨" },
  { value: "backend-engineer", label: "Backend Engineer", icon: "⚙️" },
  { value: "full-stack-engineer", label: "Full Stack Engineer", icon: "🌐" },
]

const positions = [
  { value: "Intern", label: "Intern", icon: "🎓" },
  { value: "sde1", label: "SDE 1", icon: "🚀" },
  { value: "sde2", label: "SDE 2", icon: "⭐" },
  { value: "sde3", label: "SDE 3", icon: "💎" },
  { value: "senior", label: "Senior Engineer", icon: "👑" },
  { value: "staff", label: "Staff Engineer", icon: "🏆" },
  { value: "principal", label: "Principal Engineer", icon: "🎯" },
]

const experienceYears = [
  { value: "0", label: "0 Years (Fresh Graduate)", icon: "🌱" },
  { value: "1", label: "1 Year", icon: "📈" },
  { value: "2", label: "2 Years", icon: "🔥" },
  { value: "3", label: "3 Years", icon: "⚡" },
  { value: "4", label: "4 Years", icon: "💪" },
  { value: "5", label: "5 Years", icon: "🎖️" },
  { value: "6-8", label: "6-8 Years", icon: "🏅" },
  { value: "9-12", label: "9-12 Years", icon: "👑" },
  { value: "12+", label: "12+ Years", icon: "🎯" },
]

const difficultyColors = {
  Easy: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-300 shadow-emerald-100",
  Medium: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300 shadow-amber-100",
  Hard: "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-300 shadow-rose-100",
}

const topicColors = [
  "rgba(139, 69, 19, 0.8)", // Saddle Brown
  "rgba(255, 20, 147, 0.8)", // Deep Pink
  "rgba(50, 205, 50, 0.8)", // Lime Green
  "rgba(255, 165, 0, 0.8)", // Orange
  "rgba(138, 43, 226, 0.8)", // Blue Violet
  "rgba(30, 144, 255, 0.8)", // Dodger Blue
  "rgba(220, 20, 60, 0.8)", // Crimson
  "rgba(0, 206, 209, 0.8)", // Dark Turquoise
  "rgba(255, 215, 0, 0.8)", // Gold
]

const roundTypeIcons = {
  Technical: <Code className="h-4 w-4" />,
  Behavioral: <MessageSquare className="h-4 w-4" />,
  "System Design": <Layers className="h-4 w-4" />,
  Coding: <Zap className="h-4 w-4" />,
  Interview: <Users className="h-4 w-4" />,
  "Machine Learning": <Brain className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
}

const topicIcons = {
  "Data Structures": "🏗️",
  Algorithms: "🧮",
  "System Design": "🏛️",
  Database: "🗄️",
  Networking: "🌐",
  "Operating Systems": "💻",
  "Object Oriented Programming": "🎯",
  General: "📚",
  JavaScript: "🟨",
  Python: "🐍",
  Java: "☕",
  React: "⚛️",
  "Node.js": "🟢",
}

export default function InterviewSearch() {
  const [form, setForm] = useState<SearchForm>({
    company: "",
    role: "",
    position: "",
    year: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [searchProgress, setSearchProgress] = useState(0)

  const handleSelectChange = (field: keyof SearchForm, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setSearchProgress(0)

    if (!form.company || !form.role || !form.position || !form.year) {
      setError("All fields are required.")
      return
    }

    setLoading(true)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const params = new URLSearchParams(form).toString()
      const res = await fetch(`https://algo-back-2.onrender.com/api/interview/search?${params}`)
      const data = await res.json()
      setSearchProgress(100)

      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong")
      } else {
        const questions = Array.isArray(data.questions)
          ? data.questions.map((q: any) => {
              if (typeof q === "string") {
                return {
                  text: q,
                  topic: "General",
                  roundType: "Interview",
                  difficulty: "Medium",
                  frequency: Math.floor(Math.random() * 10) + 1,
                  recency: new Date().toISOString(),
                }
              }
              return q
            })
          : []

        setTimeout(() => {
          setResult({
            totalResults: data.totalResults || 0,
            totalQuestions: data.totalQuestions || questions.length,
            questions,
          })
        }, 500)
      }
    } catch (err) {
      console.log(err)
      setError("Failed to fetch data from server.")
    }

    setTimeout(() => {
      setLoading(false)
      clearInterval(progressInterval)
    }, 1000)
  }

  const prepareChartData = () => {
    if (!result || !result.questions.length) return null

    const topicCounts: Record<string, number> = {}
    result.questions.forEach((q) => {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1
    })

    const difficultyCounts: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 }
    result.questions.forEach((q) => {
      if (q.difficulty in difficultyCounts) {
        difficultyCounts[q.difficulty]++
      } else {
        difficultyCounts["Medium"]++
      }
    })

    const roundCounts: Record<string, number> = {}
    result.questions.forEach((q) => {
      roundCounts[q.roundType] = (roundCounts[q.roundType] || 0) + 1
    })

    return {
      topics: {
        labels: Object.keys(topicCounts),
        datasets: [
          {
            data: Object.values(topicCounts),
            backgroundColor: topicColors.slice(0, Object.keys(topicCounts).length),
            borderWidth: 3,
            borderColor: "#ffffff",
            hoverBorderWidth: 4,
            hoverOffset: 8,
          },
        ],
      },
      difficulties: {
        labels: Object.keys(difficultyCounts),
        datasets: [
          {
            label: "Questions by Difficulty",
            data: Object.values(difficultyCounts),
            backgroundColor: ["rgba(34, 197, 94, 0.9)", "rgba(251, 146, 60, 0.9)", "rgba(239, 68, 68, 0.9)"],
            borderRadius: 12,
            borderSkipped: false,
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      rounds: {
        labels: Object.keys(roundCounts),
        datasets: [
          {
            label: "Questions by Round Type",
            data: Object.values(roundCounts),
            backgroundColor: [
              "rgba(139, 69, 19, 0.9)",
              "rgba(255, 20, 147, 0.9)",
              "rgba(50, 205, 50, 0.9)",
              "rgba(255, 165, 0, 0.9)",
              "rgba(138, 43, 226, 0.9)",
            ],
            borderRadius: 12,
            borderSkipped: false,
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
    }
  }

  const chartData = result ? prepareChartData() : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-1500"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-8 py-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-xl animate-pulse">
              <Sparkles className="h-5 w-5 text-purple-600 mr-3 animate-spin" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Interview Mastery Platform
              </span>
              <Star className="h-5 w-5 text-pink-600 ml-3 animate-pulse" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
                Master Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dream Interview
              </span>
            </h1>

            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              🚀 Unlock thousands of curated interview questions from
              <span className="font-bold text-purple-600"> FAANG+ companies</span>
              <br />💡 Get insights on difficulty, frequency, and success patterns
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {companies.slice(0, 5).map((company) => (
                <div
                  key={company.value}
                  className={`px-4 py-2 bg-gradient-to-r ${company.color} text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  <span className="mr-2">{company.icon}</span>
                  {company.label}
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Search Form */}
          <Card className="backdrop-blur-xl bg-white/95 border-0 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500">
            <CardHeader className="pb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Find Your Perfect Questions
                </span>
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                🎯 Select your target company and role to discover the most relevant interview questions
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Company Selection */}
                  <div className="space-y-4 group">
                    <Label className="flex items-center gap-3 text-lg font-bold text-gray-800">
                      <Building2 className="h-6 w-6 text-purple-600" />
                      Company Name
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("company", value)}>
                      <SelectTrigger className="h-14 border-3 border-purple-200 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-300 bg-gradient-to-r from-white to-purple-50">
                        <SelectValue placeholder="🏢 Choose your target company" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        {companies.map((company) => (
                          <SelectItem key={company.value} value={company.value} className="text-base py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{company.icon}</span>
                              <span className="font-semibold">{company.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-4 group">
                    <Label className="flex items-center gap-3 text-lg font-bold text-gray-800">
                      <Briefcase className="h-6 w-6 text-emerald-600" />
                      Role
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger className="h-14 border-3 border-emerald-200 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300 bg-gradient-to-r from-white to-emerald-50">
                        <SelectValue placeholder="💼 Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value} className="text-base py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{role.icon}</span>
                              <span className="font-semibold">{role.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position Level */}
                  <div className="space-y-4 group">
                    <Label className="flex items-center gap-3 text-lg font-bold text-gray-800">
                      <User className="h-6 w-6 text-blue-600" />
                      Position Level
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("position", value)}>
                      <SelectTrigger className="h-14 border-3 border-blue-200 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300 bg-gradient-to-r from-white to-blue-50">
                        <SelectValue placeholder="🎯 Choose your level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        {positions.map((position) => (
                          <SelectItem key={position.value} value={position.value} className="text-base py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{position.icon}</span>
                              <span className="font-semibold">{position.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-4 group">
                    <Label className="flex items-center gap-3 text-lg font-bold text-gray-800">
                      <Calendar className="h-6 w-6 text-orange-600" />
                      Years of Experience
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("year", value)}>
                      <SelectTrigger className="h-14 border-3 border-orange-200 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 bg-gradient-to-r from-white to-orange-50">
                        <SelectValue placeholder="📅 Select experience" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        {experienceYears.map((exp) => (
                          <SelectItem key={exp.value} value={exp.value} className="text-base py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{exp.icon}</span>
                              <span className="font-semibold">{exp.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {loading && (
                  <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-purple-700 font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 animate-spin" />
                        Searching interview database...
                      </span>
                      <span className="font-bold text-purple-600 text-xl">{searchProgress}%</span>
                    </div>
                    <Progress value={searchProgress} className="h-3 bg-purple-100" />
                    <div className="text-sm text-purple-600 text-center">
                      🔍 Analyzing {searchProgress < 50 ? "questions" : searchProgress < 80 ? "patterns" : "results"}...
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl hover:shadow-purple-500/50 border-0"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-4 h-6 w-6 animate-spin" />
                      <span className="animate-pulse">Searching Database...</span>
                    </>
                  ) : (
                    <>
                      <Search className="mr-4 h-6 w-6" />🚀 Find My Interview Questions
                      <ChevronRight className="ml-4 h-6 w-6 animate-pulse" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="destructive"
              className="border-red-300 bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 shadow-lg"
            >
              <AlertDescription className="text-red-800 font-semibold text-lg">{error}</AlertDescription>
            </Alert>
          )}

          {/* Enhanced Results Section */}
          {result && result.questions.length > 0 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* Enhanced Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 font-bold text-sm uppercase tracking-wider">Total Questions</p>
                        <p className="text-5xl font-black mt-2">{result.totalQuestions}</p>
                        <p className="text-blue-200 text-sm mt-1">Ready to practice</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <BookOpen className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 transform hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 font-bold text-sm uppercase tracking-wider">Interview Records</p>
                        <p className="text-5xl font-black mt-2">{result.totalResults}</p>
                        <p className="text-emerald-200 text-sm mt-1">Real experiences</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <TrendingUp className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 transform hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-100 font-bold text-sm uppercase tracking-wider">Success Rate</p>
                        <p className="text-5xl font-black mt-2">94%</p>
                        <p className="text-pink-200 text-sm mt-1">Average score</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Award className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Main Results */}
              <Card className="backdrop-blur-xl bg-white/95 border-0 shadow-2xl shadow-gray-500/20">
                <CardHeader className="border-b border-gray-100 pb-8 bg-gradient-to-r from-gray-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-black bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                        🎯 Interview Questions Analysis
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 mt-3 font-medium">
                        Comprehensive breakdown of{" "}
                        <span className="font-bold text-purple-600">{result.totalQuestions}</span> questions from{" "}
                        <span className="font-bold text-emerald-600">{result.totalResults}</span> real interview
                        experiences
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="lg" className="gap-2 border-2 hover:bg-purple-50">
                        <Filter className="h-5 w-5" />
                        Filter
                      </Button>
                      <Button variant="outline" size="lg" className="gap-2 border-2 hover:bg-blue-50">
                        <SortDesc className="h-5 w-5" />
                        Sort
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Tabs defaultValue="questions" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-50 to-pink-50 p-2 m-8 mb-0 rounded-xl">
                      <TabsTrigger
                        value="questions"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-lg text-lg font-semibold py-3"
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        Questions
                      </TabsTrigger>
                      <TabsTrigger
                        value="topics"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-lg text-lg font-semibold py-3"
                      >
                        <PieChart className="h-5 w-5 mr-2" />
                        Analytics
                      </TabsTrigger>
                      <TabsTrigger
                        value="difficulty"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-lg text-lg font-semibold py-3"
                      >
                        <BarChart2 className="h-5 w-5 mr-2" />
                        Difficulty
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="questions" className="space-y-6 p-8 pt-6">
                      <div className="grid gap-6">
                        {result.questions.map((question, index) => (
                          <Card
                            key={index}
                            className="group hover:shadow-2xl transition-all duration-500 border-l-8 border-l-purple-500 hover:border-l-pink-500 bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 hover:from-purple-50/50 hover:to-pink-50/50 transform hover:scale-[1.02]"
                          >
                            <CardContent className="p-8">
                              <div className="space-y-6">
                                <div className="flex items-start justify-between gap-6">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                        <Lightbulb className="h-5 w-5 text-white" />
                                      </div>
                                      <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                        Question #{index + 1}
                                      </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 leading-relaxed group-hover:text-purple-900 transition-colors">
                                      {question.text}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-semibold">Recent</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                  <Badge
                                    variant="outline"
                                    className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300 hover:from-blue-100 hover:to-cyan-100 transition-all px-4 py-2 text-sm font-semibold shadow-md"
                                  >
                                    <span className="mr-2 text-lg">
                                      {topicIcons[question.topic as keyof typeof topicIcons] || "📚"}
                                    </span>
                                    {question.topic}
                                  </Badge>

                                  <Badge
                                    variant="outline"
                                    className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-300 hover:from-purple-100 hover:to-pink-100 transition-all px-4 py-2 text-sm font-semibold shadow-md"
                                  >
                                    <span className="mr-2">
                                      {roundTypeIcons[question.roundType as keyof typeof roundTypeIcons] || (
                                        <Award className="h-4 w-4" />
                                      )}
                                    </span>
                                    {question.roundType}
                                  </Badge>

                                  <Badge
                                    variant="outline"
                                    className={`${difficultyColors[question.difficulty as keyof typeof difficultyColors] || "bg-gray-100"} hover:shadow-lg transition-all px-4 py-2 text-sm font-bold shadow-md`}
                                  >
                                    <Target className="h-4 w-4 mr-2" />
                                    {question.difficulty}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                                  <div className="flex items-center gap-8 text-sm">
                                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full">
                                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                                      <span className="font-semibold text-gray-700">Frequency:</span>
                                      <span className="font-black text-emerald-600 text-lg">
                                        {question.frequency || Math.floor(Math.random() * 10) + 1}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
                                      <Calendar className="h-5 w-5 text-blue-500" />
                                      <span className="font-semibold text-gray-700">Asked:</span>
                                      <span className="font-black text-blue-600">
                                        {question.recency
                                          ? new Date(question.recency).toLocaleDateString()
                                          : "Recently"}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="lg"
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                  >
                                    <span className="mr-2">View Details</span>
                                    <ChevronRight className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="topics" className="p-8 pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 hover:shadow-2xl transition-all duration-500">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-2xl flex items-center gap-4">
                              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                <PieChart className="h-6 w-6 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-black">
                                Questions by Topic
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex justify-center pb-8">
                            <div className="w-full max-w-sm aspect-square">
                              {chartData && (
                                <Pie
                                  data={chartData.topics}
                                  options={{
                                    responsive: true,
                                    plugins: {
                                      legend: {
                                        position: "bottom",
                                        labels: {
                                          padding: 25,
                                          usePointStyle: true,
                                          font: {
                                            size: 14,
                                            weight: "bold",
                                          },
                                        },
                                      },
                                      tooltip: {
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                        titleColor: "white",
                                        bodyColor: "white",
                                        borderColor: "rgba(255,255,255,0.3)",
                                        borderWidth: 1,
                                      },
                                    },
                                  }}
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200 hover:shadow-2xl transition-all duration-500">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-2xl flex items-center gap-4">
                              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                <BarChart2 className="h-6 w-6 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-black">
                                Questions by Round Type
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-8">
                            <div className="w-full h-80">
                              {chartData && (
                                <Bar
                                  data={chartData.rounds}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                      legend: {
                                        display: false,
                                      },
                                      tooltip: {
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                        titleColor: "white",
                                        bodyColor: "white",
                                        borderColor: "rgba(255,255,255,0.3)",
                                        borderWidth: 1,
                                      },
                                    },
                                    scales: {
                                      y: {
                                        beginAtZero: true,
                                        ticks: {
                                          precision: 0,
                                          font: {
                                            weight: "bold",
                                          },
                                        },
                                        grid: {
                                          color: "rgba(0,0,0,0.1)",
                                        },
                                      },
                                      x: {
                                        grid: {
                                          display: false,
                                        },
                                        ticks: {
                                          font: {
                                            weight: "bold",
                                          },
                                        },
                                      },
                                    },
                                  }}
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="difficulty" className="p-8 pt-6">
                      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 hover:shadow-2xl transition-all duration-500">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-2xl flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                              <BarChart2 className="h-6 w-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black">
                              Questions by Difficulty Level
                            </span>
                          </CardTitle>
                          <CardDescription className="text-lg font-medium text-gray-600 ml-16">
                            🎯 Distribution of questions across different difficulty levels
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                          <div className="w-full h-96">
                            {chartData && (
                              <Bar
                                data={chartData.difficulties}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false,
                                    },
                                    tooltip: {
                                      backgroundColor: "rgba(0,0,0,0.8)",
                                      titleColor: "white",
                                      bodyColor: "white",
                                      borderColor: "rgba(255,255,255,0.3)",
                                      borderWidth: 1,
                                    },
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      ticks: {
                                        precision: 0,
                                        font: {
                                          size: 14,
                                          weight: "bold",
                                        },
                                      },
                                      grid: {
                                        color: "rgba(0,0,0,0.1)",
                                      },
                                    },
                                    x: {
                                      grid: {
                                        display: false,
                                      },
                                      ticks: {
                                        font: {
                                          size: 14,
                                          weight: "bold",
                                        },
                                      },
                                    },
                                  },
                                }}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
