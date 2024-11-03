'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Search, Clock, Leaf, Scale, HelpCircle, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePDF } from 'react-to-pdf'
import AssistantLayout from '@/components/AssistantLayout'
import FunctionButton from '@/components/FunctionButton'
import OutputDisplay from '@/components/OutputDisplay'

type FunctionType = 'findRecipe' | 'convertMeasurements' | 'suggestSubstitutions' | 'explainTechnique' | 'planMeal' | 'nutritionInfo'

export default function RecipeMaster() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState('general')
  const [currentFunction, setCurrentFunction] = useState<FunctionType>('findRecipe')

  const { toPDF, targetRef } = usePDF();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const createPrompt = (functionType: FunctionType, input: string) => {
    const cuisineContext = selectedCuisine !== 'general' ? `dans la cuisine ${selectedCuisine}` : ''
    switch (functionType) {
      case 'findRecipe':
        return `En tant que chef expérimenté ${cuisineContext}, suggérez une recette détaillée pour : "${input}". Incluez les ingrédients, les étapes de préparation et le temps de cuisson. Formatez votre réponse en Markdown avec des titres et des listes à puces.`
      case 'convertMeasurements':
        return `Convertissez les mesures suivantes en unités métriques et impériales : "${input}". Formatez votre réponse en Markdown avec un tableau pour une meilleure lisibilité.`
      case 'suggestSubstitutions':
        return `Suggérez des substitutions pour les ingrédients suivants ${cuisineContext}, en tenant compte des allergies et des régimes spéciaux : "${input}". Formatez votre réponse en Markdown avec des listes à puces.`
      case 'explainTechnique':
        return `Expliquez en détail la technique culinaire suivante, comme si vous l'enseigniez à un débutant : "${input}". Formatez votre réponse en Markdown avec des titres, des sous-titres et des étapes numérotées.`
      case 'planMeal':
        return `Proposez un plan de repas équilibré pour une journée ${cuisineContext}, basé sur les préférences suivantes : "${input}". Formatez votre réponse en Markdown avec des titres pour chaque repas et des listes à puces pour les plats.`
      case 'nutritionInfo':
        return `Fournissez des informations nutritionnelles approximatives pour le plat suivant ${cuisineContext} : "${input}". Incluez les calories, les protéines, les glucides et les lipides. Formatez votre réponse en Markdown avec un tableau pour les valeurs nutritionnelles.`
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
      findRecipe: 'Recette',
      convertMeasurements: 'Conversion_Mesures',
      suggestSubstitutions: 'Substitutions',
      explainTechnique: 'Technique_Culinaire',
      planMeal: 'Plan_Repas',
      nutritionInfo: 'Info_Nutritionnelle'
    };
    const truncatedInput = input.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${functionNames[currentFunction]}_${truncatedInput}.pdf`;
  };

  return (
    <AssistantLayout title="RecipeMaster - Assistant Culinaire" bgColor="bg-red-100" textColor="text-red-800">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select onValueChange={setSelectedCuisine} defaultValue={selectedCuisine}>
              <SelectTrigger className="w-full sm:w-[200px] border-red-200">
                <SelectValue placeholder="Sélectionnez une cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="française">Française</SelectItem>
                <SelectItem value="italienne">Italienne</SelectItem>
                <SelectItem value="japonaise">Japonaise</SelectItem>
                <SelectItem value="indienne">Indienne</SelectItem>
                <SelectItem value="mexicaine">Mexicaine</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <FunctionButton icon={<Utensils className="w-4 h-4 mr-2" />} onClick={() => handleFunction('findRecipe')} disabled={isLoading} borderColor="border-red-200" hoverBgColor="hover:bg-red-100">
                Trouver une recette
              </FunctionButton>
              <FunctionButton icon={<Scale className="w-4 h-4 mr-2" />} onClick={() => handleFunction('convertMeasurements')} disabled={isLoading} borderColor="border-red-200" hoverBgColor="hover:bg-red-100">
                Convertir des mesures
              </FunctionButton>
              <FunctionButton icon={<Leaf className="w-4 h-4 mr-2" />} onClick={() => handleFunction('suggestSubstitutions')} disabled={isLoading} borderColor="border-red-200" hoverBgColor="hover:bg-red-100">
                Suggérer des substitutions
              </FunctionButton>
              <FunctionButton icon={<HelpCircle className="w-4 h-4 mr-2" />} onClick={() => handleFunction('explainTechnique')} disabled={isLoading} borderColor="border-red-200" hoverBgColor="hover:bg-red-100">
                Expliquer une technique
              </FunctionButton>
              <FunctionButton icon={<Clock className="w-4 h-4 mr-2" />} onClick={() => handleFunction('planMeal')} disabled={isLoading} borderColor="border-red-200" hoverBgColor="hover:bg-red-100">
                Planifier un repas
              </FunctionButton>
              <FunctionButton icon={<Search className="w-4 h-4 mr-2" />} onClick={() => handleFunction('nutritionInfo')} disabled={isLoading} borderColor="border-red-200" hoverBgColor="hover:bg-red-100">
                Info nutritionnelle
              </FunctionButton>
            </div>
          </div>

          <Textarea 
            placeholder="Entrez votre question culinaire, ingrédients ou plat ici..."
            value={input}
            onChange={handleInputChange}
            className="min-h-[200px] border-red-200"
          />

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleFunction('findRecipe')}
            disabled={isLoading}
          >
            {isLoading ? 'Préparation en cours...' : 'Cuisiner !'}
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
        Remarque : Les informations nutritionnelles sont approximatives. Consultez un professionnel de santé pour des conseils diététiques personnalisés.
      </p>
    </AssistantLayout>
  )
}