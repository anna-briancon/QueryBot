'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Heart, Apple, Clock, Calendar, HelpCircle, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePDF } from 'react-to-pdf'
import AssistantLayout from '@/components/AssistantLayout'
import FunctionButton from '@/components/FunctionButton'
import OutputDisplay from '@/components/OutputDisplay'

type FunctionType = 'createWorkout' | 'nutritionAdvice' | 'exerciseExplanation' | 'fitnessGoals' | 'recoveryTips' | 'progressTracking'

export default function FitnessFinder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFitnessType, setSelectedFitnessType] = useState('general')
  const [currentFunction, setCurrentFunction] = useState<FunctionType>('createWorkout')

  const { toPDF, targetRef } = usePDF();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const createPrompt = (functionType: FunctionType, input: string) => {
    const fitnessContext = selectedFitnessType !== 'general' ? `pour un entraînement de type ${selectedFitnessType}` : ''
    switch (functionType) {
      case 'createWorkout':
        return `En tant que coach de fitness professionnel, créez un programme d'entraînement détaillé ${fitnessContext} basé sur les informations suivantes : "${input}". Incluez des exercices spécifiques, des séries, des répétitions et des conseils de forme. Formatez votre réponse en Markdown avec des titres pour chaque jour ou partie de l'entraînement, et des listes à puces pour les exercices et les conseils.`
      case 'nutritionAdvice':
        return `En tant que nutritionniste spécialisé en fitness, fournissez des conseils nutritionnels ${fitnessContext} pour l'objectif suivant : "${input}". Incluez des suggestions de repas et des recommandations de macronutriments. Formatez votre réponse en Markdown avec des titres pour chaque catégorie de conseils, des listes à puces pour les suggestions, et un tableau pour les recommandations de macronutriments.`
      case 'exerciseExplanation':
        return `Expliquez en détail comment effectuer correctement l'exercice suivant ${fitnessContext} : "${input}". Incluez la technique correcte, les muscles ciblés et les erreurs courantes à éviter. Formatez votre réponse en Markdown avec des sous-titres pour chaque aspect de l'explication et des listes à puces pour les points clés.`
      case 'fitnessGoals':
        return `En tant que coach de vie spécialisé en fitness, aidez à définir des objectifs SMART ${fitnessContext} pour l'objectif général suivant : "${input}". Fournissez des étapes concrètes et un calendrier réaliste. Formatez votre réponse en Markdown avec un titre pour chaque objectif SMART, des listes numérotées pour les étapes, et un tableau pour le calendrier.`
      case 'recoveryTips':
        return `Donnez des conseils de récupération et de prévention des blessures ${fitnessContext} pour le type d'entraînement suivant : "${input}". Incluez des techniques de récupération active et passive. Formatez votre réponse en Markdown avec des titres pour chaque catégorie de conseils et des listes à puces pour les techniques spécifiques.`
      case 'progressTracking':
        return `Suggérez des méthodes efficaces pour suivre les progrès ${fitnessContext} pour l'objectif suivant : "${input}". Incluez des mesures quantitatives et qualitatives à surveiller. Formatez votre réponse en Markdown avec des titres pour chaque méthode de suivi et des listes à puces pour les mesures spécifiques.`
      default:
        return input
    }
  }

  const handleFunction = async (functionType: FunctionType) => {
    setCurrentFunction(functionType);
    setIsLoading(true);
    try {
      const prompt = createPrompt(functionType, input);
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      const data = await response.json();
      setOutput(data.result);
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la fonction:', error);
      setOutput("Une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateFilename = () => {
    const functionNames: Record<FunctionType, string> = {
      createWorkout: 'Programme_Entrainement',
      nutritionAdvice: 'Conseils_Nutrition',
      exerciseExplanation: 'Explication_Exercice',
      fitnessGoals: 'Objectifs_Fitness',
      recoveryTips: 'Conseils_Recuperation',
      progressTracking: 'Suivi_Progres'
    };
    const truncatedInput = input.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${functionNames[currentFunction]}_${truncatedInput}.pdf`;
  };

  return (
    <AssistantLayout title="FitnessFinder - Votre Coach Personnel" bgColor="bg-orange-100" textColor="text-orange-800">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select onValueChange={setSelectedFitnessType} defaultValue={selectedFitnessType}>
              <SelectTrigger className="w-full sm:w-[200px] border-orange-200">
                <SelectValue placeholder="Type d'entraînement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="musculation">Musculation</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="crossfit">CrossFit</SelectItem>
                <SelectItem value="perte_de_poids">Perte de poids</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <FunctionButton icon={<Dumbbell className="w-4 h-4 mr-2" />} onClick={() => handleFunction('createWorkout')} disabled={isLoading} borderColor="border-orange-200" hoverBgColor="hover:bg-orange-100">
                Créer un programme
              </FunctionButton>
              <FunctionButton icon={<Apple className="w-4 h-4 mr-2" />} onClick={() => handleFunction('nutritionAdvice')} disabled={isLoading} borderColor="border-orange-200" hoverBgColor="hover:bg-orange-100">
                Conseils nutrition
              </FunctionButton>
              <FunctionButton icon={<HelpCircle className="w-4 h-4 mr-2" />} onClick={() => handleFunction('exerciseExplanation')} disabled={isLoading} borderColor="border-orange-200" hoverBgColor="hover:bg-orange-100">
                Expliquer un exercice
              </FunctionButton>
              <FunctionButton icon={<Heart className="w-4 h-4 mr-2" />} onClick={() => handleFunction('fitnessGoals')} disabled={isLoading} borderColor="border-orange-200" hoverBgColor="hover:bg-orange-100">
                Définir des objectifs
              </FunctionButton>
              <FunctionButton icon={<Clock className="w-4 h-4 mr-2" />} onClick={() => handleFunction('recoveryTips')} disabled={isLoading} borderColor="border-orange-200" hoverBgColor="hover:bg-orange-100">
                Conseils de récupération
              </FunctionButton>
              <FunctionButton icon={<Calendar className="w-4 h-4 mr-2" />} onClick={() => handleFunction('progressTracking')} disabled={isLoading} borderColor="border-orange-200" hoverBgColor="hover:bg-orange-100">
                Suivi des progrès
              </FunctionButton>
            </div>
          </div>

          <Textarea 
            placeholder="Entrez vos objectifs fitness, votre niveau actuel, ou posez une question spécifique..."
            value={input}
            onChange={handleInputChange}
            className="min-h-[200px] border-orange-200"
          />

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleFunction('createWorkout')}
            disabled={isLoading}
          >
            {isLoading ? 'Préparation en cours...' : 'Obtenir mon programme fitness'}
          </Button>

          {output && <OutputDisplay output={output} targetRef={targetRef} />}

          {output && (
            <Button 
              onClick={() => toPDF({ filename: generateFilename() })}
              className="w-full text-white bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter en PDF
            </Button>
          )}
        </CardContent>
      </Card>
      
      <p className="text-sm text-center text-black">
        Note : Les conseils fournis sont à titre indicatif. Consultez un professionnel de santé avant de commencer tout nouveau programme d&apos;exercice ou régime alimentaire.
      </p>
    </AssistantLayout>
  )
}