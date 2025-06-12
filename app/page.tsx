// "use client"

import InterviewSearch from "./Interview-search-enhanced";


// import { useState, type ChangeEvent, type FormEvent } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { BarChart2, Briefcase, Building2, Calendar, Loader2, PieChart, Search, User } from 'lucide-react'

// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
// import { Pie, Bar } from "react-chartjs-2"

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

// type Question = {
//   text: string
//   topic: string
//   roundType: string
//   difficulty: string
//   frequency?: number
//   recency?: string
// }

// type SearchForm = {
//   company: string
//   role: string
//   position: string
//   year: string
// }

// type SearchResult = {
//   totalResults: number
//   totalQuestions: number
//   questions: Question[]
// }

// const difficultyColors = {
//   Easy: "bg-green-100 text-green-800 border-green-200",
//   Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   Hard: "bg-red-100 text-red-800 border-red-200",
// }

// const topicColors = [
//   "rgba(255, 99, 132, 0.7)",
//   "rgba(54, 162, 235, 0.7)",
//   "rgba(255, 206, 86, 0.7)",
//   "rgba(75, 192, 192, 0.7)",
//   "rgba(153, 102, 255, 0.7)",
//   "rgba(255, 159, 64, 0.7)",
//   "rgba(199, 199, 199, 0.7)",
//   "rgba(83, 102, 255, 0.7)",
//   "rgba(255, 99, 255, 0.7)",
// ]

// export default function InterviewSearch() {
//   const [form, setForm] = useState<SearchForm>({
//     company: "",
//     role: "",
//     position: "",
//     year: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [result, setResult] = useState<SearchResult | null>(null)

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setResult(null)

//     if (!form.company || !form.role || !form.position || !form.year) {
//       setError("All fields are required.")
//       return
//     }

//     setLoading(true)
//     try {
//       const params = new URLSearchParams(form).toString()
//       const res = await fetch(`http://localhost:5000/api/interview/search?${params}`)

//       const data = await res.json()

//       if (!res.ok) {
//         setError(data.error || data.message || "Something went wrong")
//       } else {
//         const questions = Array.isArray(data.questions)
//           ? data.questions.map((q: any) => {
//               if (typeof q === "string") {
//                 return {
//                   text: q,
//                   topic: "General",
//                   roundType: "Interview",
//                   difficulty: "Medium",
//                   frequency: 1,
//                   recency: new Date().toISOString(),
//                 }
//               }
//               return q
//             })
//           : []

//         setResult({
//           totalResults: data.totalResults || 0,
//           totalQuestions: data.totalQuestions || questions.length,
//           questions,
//         })
//       }
//     } catch (err) {
//       console.log(err)
//       setError("Failed to fetch data from server.")
//     }
//     setLoading(false)
//   }

//   const prepareChartData = () => {
//     if (!result || !result.questions.length) return null

//     const topicCounts: Record<string, number> = {}
//     result.questions.forEach((q) => {
//       topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1
//     })

//     const difficultyCounts: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 }
//     result.questions.forEach((q) => {
//       if (q.difficulty in difficultyCounts) {
//         difficultyCounts[q.difficulty]++
//       } else {
//         difficultyCounts["Medium"]++
//       }
//     })

//     const roundCounts: Record<string, number> = {}
//     result.questions.forEach((q) => {
//       roundCounts[q.roundType] = (roundCounts[q.roundType] || 0) + 1
//     })

//     return {
//       topics: {
//         labels: Object.keys(topicCounts),
//         datasets: [
//           {
//             data: Object.values(topicCounts),
//             backgroundColor: topicColors.slice(0, Object.keys(topicCounts).length),
//             borderWidth: 1,
//           },
//         ],
//       },
//       difficulties: {
//         labels: Object.keys(difficultyCounts),
//         datasets: [
//           {
//             label: "Questions by Difficulty",
//             data: Object.values(difficultyCounts),
//             backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 206, 86, 0.7)", "rgba(255, 99, 132, 0.7)"],
//           },
//         ],
//       },
//       rounds: {
//         labels: Object.keys(roundCounts),
//         datasets: [
//           {
//             label: "Questions by Round Type",
//             data: Object.values(roundCounts),
//             backgroundColor: "rgba(54, 162, 235, 0.7)",
//           },
//         ],
//       },
//     }
//   }

//   const chartData = result ? prepareChartData() : null

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-5xl mx-auto space-y-8">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-gray-900">Interview Questions Search</h1>
//           <p className="text-gray-600">Find interview questions based on company, role, position, and experience</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Search className="h-5 w-5" />
//               Search Interview Questions
//             </CardTitle>
//             <CardDescription>Enter the details to find relevant interview questions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="company" className="flex items-center gap-2">
//                     <Building2 className="h-4 w-4" />
//                     Company Name
//                   </Label>
//                   <Input id="company" name="company" placeholder="e.g., Google" value={form.company} onChange={handleChange} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="role" className="flex items-center gap-2">
//                     <Briefcase className="h-4 w-4" />
//                     Role
//                   </Label>
//                   <Input id="role" name="role" placeholder="e.g., Backend Developer" value={form.role} onChange={handleChange} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="position" className="flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Position Level
//                   </Label>
//                   <Input id="position" name="position" placeholder="e.g., SDE 2" value={form.position} onChange={handleChange} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="year" className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Years of Experience
//                   </Label>
//                   <Input id="year" name="year" placeholder="e.g., 3" value={form.year} onChange={handleChange} />
//                 </div>
//               </div>
//               <Button type="submit" className="w-full" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Searching...
//                   </>
//                 ) : (
//                   <>
//                     <Search className="mr-2 h-4 w-4" />
//                     Search Questions
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {error && (
//           <Alert variant="destructive">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {result && result.questions.length > 0 && (
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Search Results</CardTitle>
//                 <CardDescription>
//                   Found {result.totalQuestions} questions from {result.totalResults} interview records
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Tabs defaultValue="questions" className="w-full">
//                   <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger value="questions">Questions</TabsTrigger>
//                     <TabsTrigger value="topics">Topics</TabsTrigger>
//                     <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
//                   </TabsList>

//                   <TabsContent value="questions" className="space-y-4 pt-4">
//                     {result.questions.map((question, index) => (
//                       <Card key={index}>
//                         <CardHeader className="bg-gray-50 py-3">
//                           <CardTitle className="text-lg">{question.text}</CardTitle>
//                         </CardHeader>
//                         <CardContent className="pt-4">
//                           <div className="flex flex-wrap gap-2 mb-3">
//                             <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
//                               {question.topic}
//                             </Badge>
//                             <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
//                               {question.roundType}
//                             </Badge>
//                             <Badge variant="outline" className={difficultyColors[question.difficulty as keyof typeof difficultyColors] || "bg-gray-100"}>
//                               {question.difficulty}
//                             </Badge>
//                           </div>
//                           <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
//                             <div className="flex items-center gap-1">
//                               <span className="font-medium">Frequency:</span>
//                               <span>{question.frequency || "N/A"}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <span className="font-medium">Recency:</span>
//                               <span>{question.recency ? new Date(question.recency).toLocaleDateString() : "N/A"}</span>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </TabsContent>

//                   <TabsContent value="topics" className="pt-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             <PieChart className="h-5 w-5" />
//                             Questions by Topic
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="flex justify-center">
//                           <div className="w-full max-w-xs aspect-square">
//                             {chartData && <Pie data={chartData.topics} options={{ responsive: true }} />}
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             <BarChart2 className="h-5 w-5" />
//                             Questions by Round Type
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="flex justify-center">
//                           <div className="w-full h-64">
//                             {chartData && (
//                               <Bar
//                                 data={chartData.rounds}
//                                 options={{
//                                   responsive: true,
//                                   maintainAspectRatio: false,
//                                   scales: {
//                                     y: {
//                                       beginAtZero: true,
//                                       ticks: { precision: 0 },
//                                     },
//                                   },
//                                 }}
//                               />
//                             )}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="difficulty" className="pt-4">
//                     <Card>
//                       <CardHeader>
//                         <CardTitle className="text-lg flex items-center gap-2">
//                           <BarChart2 className="h-5 w-5" />
//                           Questions by Difficulty
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="flex justify-center">
//                         <div className="w-full max-w-md h-64">
//                           {chartData && (
//                             <Bar
//                               data={chartData.difficulties}
//                               options={{
//                                 responsive: true,
//                                 maintainAspectRatio: false,
//                                 scales: {
//                                   y: {
//                                     beginAtZero: true,
//                                     ticks: { precision: 0 },
//                                   },
//                                 },
//                               }}
//                             />
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

export default function Page() {
  return <InterviewSearch/>
}

