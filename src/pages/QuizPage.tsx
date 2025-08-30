"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import {Link} from "react-router-dom"

interface Question {
  id: number
  text: string
  trait: "O" | "C" | "E" | "A" | "N"
  options: {
    text: string
    score: number
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "I enjoy exploring new ideas and concepts",
    trait: "O",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 2,
    text: "I am always prepared and organized",
    trait: "C",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 3,
    text: "I feel energized when around other people",
    trait: "E",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 4,
    text: "I try to be kind and considerate to others",
    trait: "A",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 5,
    text: "I often feel anxious or worried",
    trait: "N",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 6,
    text: "I appreciate art, music, and creative expression",
    trait: "O",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 7,
    text: "I follow through on my commitments",
    trait: "C",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 8,
    text: "I enjoy being the center of attention",
    trait: "E",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 9,
    text: "I trust others and assume good intentions",
    trait: "A",
    options: [
      { text: "Strongly Disagree", score: 1 },
      { text: "Disagree", score: 2 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 4 },
      { text: "Strongly Agree", score: 5 },
    ],
  },
  {
    id: 10,
    text: "I remain calm under pressure",
    trait: "N",
    options: [
      { text: "Strongly Disagree", score: 5 },
      { text: "Disagree", score: 4 },
      { text: "Neutral", score: 3 },
      { text: "Agree", score: 2 },
      { text: "Strongly Agree", score: 1 },
    ],
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswerSelect = (score: number) => {
    setSelectedAnswer(score)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: selectedAnswer,
      }))

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] || null)
    }
  }

  const calculateResults = () => {
    const traitScores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
    const traitCounts = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        traitScores[question.trait] += answer
        traitCounts[question.trait]++
      }
    })

    return {
      Openness: Math.round((traitScores.O / traitCounts.O / 5) * 100),
      Conscientiousness: Math.round((traitScores.C / traitCounts.C / 5) * 100),
      Extraversion: Math.round((traitScores.E / traitCounts.E / 5) * 100),
      Agreeableness: Math.round((traitScores.A / traitCounts.A / 5) * 100),
      Neuroticism: Math.round((traitScores.N / traitCounts.N / 5) * 100),
    }
  }

  if (showResults) {
    const results = calculateResults()
    return (
      <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 p-4">
        <div className="max-w-sm mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-greenery-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-greenery-700">Quiz Complete!</CardTitle>
              <p className="text-sm text-gray-600">Here are your personality results</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results).map(([trait, score]) => (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{trait}</span>
                    <Badge variant="secondary" className="text-xs">
                      {score}%
                    </Badge>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
              <Link to="/advice">
                <Button className="w-full mt-6 bg-greenery-500 hover:bg-greenery-600 text-white">
                  View Personalized Advice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 p-4">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/home">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="w-5 h-5 text-greenery-700" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-greenery-600" />
            <h1 className="text-lg font-bold text-greenery-700">Personality Quiz</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-gray-600 text-center">{Math.round(progress)}% Complete</p>
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-base text-gray-800 leading-relaxed">{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.score)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option.score
                    ? "border-greenery-500 bg-greenery-50 text-greenery-700"
                    : "border-gray-200 bg-white hover:border-greenery-300 hover:bg-greenery-25"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswer === option.score ? "border-greenery-500 bg-greenery-500" : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === option.score && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between space-x-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="flex-1 bg-greenery-500 hover:bg-greenery-600 text-white"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
