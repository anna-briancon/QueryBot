'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Map, Calendar, Compass, Utensils, Bed, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePDF } from 'react-to-pdf'
import AssistantLayout from '@/components/AssistantLayout'
import FunctionButton from '@/components/FunctionButton'
import OutputDisplay from '@/components/OutputDisplay'

type FunctionType = 'suggestDestination' | 'planItinerary' | 'findActivities' | 'recommendAccommodation' | 'localCuisine' | 'travelTips'

export default function TravelScout() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTravelType, setSelectedTravelType] = useState('general')
  const [currentFunction, setCurrentFunction] = useState<FunctionType>('suggestDestination')

  const { toPDF, targetRef } = usePDF();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const createPrompt = (functionType: FunctionType, input: string) => {
    const travelContext = selectedTravelType !== 'general' ? `pour un voyage de type ${selectedTravelType}` : ''
    switch (functionType) {
      case 'suggestDestination':
        return `En tant qu'expert en voyage, suggérez 3 destinations idéales ${travelContext} basées sur les critères suivants : "${input}". Détaillez les attraits de chaque destination. Formatez votre réponse en Markdown avec des titres, des listes à puces et des emphases.`
      case 'planItinerary':
        return `Créez un itinéraire détaillé ${travelContext} pour la destination suivante : "${input}". Incluez des activités jour par jour et des conseils pratiques. Formatez votre réponse en Markdown avec des titres pour chaque jour, des listes à puces pour les activités et des emphases pour les conseils importants.`
      case 'findActivities':
        return `Recommandez 5 activités ou attractions incontournables ${travelContext} pour la destination suivante : "${input}". Fournissez une brève description et des conseils pour chaque activité. Formatez votre réponse en Markdown avec des titres pour chaque activité et des listes à puces pour les détails.`
      case 'recommendAccommodation':
        return `Suggérez 3 options d'hébergement ${travelContext} pour la destination suivante : "${input}". Incluez une variété de budgets et de styles, avec les avantages de chaque option. Formatez votre réponse en Markdown avec des titres pour chaque hébergement et des listes à puces pour les détails.`
      case 'localCuisine':
        return `Présentez 5 spécialités culinaires locales à essayer ${travelContext} dans la destination suivante : "${input}". Décrivez chaque plat et où le trouver. Formatez votre réponse en Markdown avec des titres pour chaque plat et des emphases pour les informations importantes.`
      case 'travelTips':
        return `Fournissez des conseils de voyage essentiels ${travelContext} pour la destination suivante : "${input}". Incluez des informations sur la culture locale, la sécurité, les transports et les meilleures périodes pour visiter. Formatez votre réponse en Markdown avec des titres pour chaque catégorie de conseils et des listes à puces pour les détails.`
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
      suggestDestination: 'Suggestions_Destinations',
      planItinerary: 'Itineraire_Voyage',
      findActivities: 'Activites_Recommandees',
      recommendAccommodation: 'Hebergements_Recommandes',
      localCuisine: 'Cuisine_Locale',
      travelTips: 'Conseils_Voyage'
    };
    const truncatedInput = input.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${functionNames[currentFunction]}_${truncatedInput}.pdf`;
  };

  return (
    <AssistantLayout title="TravelScout - Planification de Voyage" bgColor="bg-purple-100" textColor="text-purple-800">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select onValueChange={setSelectedTravelType} defaultValue={selectedTravelType}>
              <SelectTrigger className="w-full sm:w-[200px] border-purple-200">
                <SelectValue placeholder="Type de voyage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="culturel">Culturel</SelectItem>
                <SelectItem value="aventure">Aventure</SelectItem>
                <SelectItem value="detente">Détente</SelectItem>
                <SelectItem value="gastronomique">Gastronomique</SelectItem>
                <SelectItem value="ecotourisme">Écotourisme</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <FunctionButton icon={<Plane className="w-4 h-4 mr-2" />} onClick={() => handleFunction('suggestDestination')} disabled={isLoading} borderColor="border-purple-200" hoverBgColor="hover:bg-purple-100">
                Suggérer une destination
              </FunctionButton>
              <FunctionButton icon={<Calendar className="w-4 h-4 mr-2" />} onClick={() => handleFunction('planItinerary')} disabled={isLoading} borderColor="border-purple-200" hoverBgColor="hover:bg-purple-100">
                Planifier un itinéraire
              </FunctionButton>
              <FunctionButton icon={<Compass className="w-4 h-4 mr-2" />} onClick={() => handleFunction('findActivities')} disabled={isLoading} borderColor="border-purple-200" hoverBgColor="hover:bg-purple-100">
                Trouver des activités
              </FunctionButton>
              <FunctionButton icon={<Bed className="w-4 h-4 mr-2" />} onClick={() => handleFunction('recommendAccommodation')} disabled={isLoading} borderColor="border-purple-200" hoverBgColor="hover:bg-purple-100">
                Recommander un hébergement
              </FunctionButton>
              <FunctionButton icon={<Utensils className="w-4 h-4 mr-2" />} onClick={() => handleFunction('localCuisine')} disabled={isLoading} borderColor="border-purple-200" hoverBgColor="hover:bg-purple-100">
                Cuisine locale
              </FunctionButton>
              <FunctionButton icon={<Map className="w-4 h-4 mr-2" />} onClick={() => handleFunction('travelTips')} disabled={isLoading} borderColor="border-purple-200" hoverBgColor="hover:bg-purple-100">
                Conseils de voyage
              </FunctionButton>
            </div>
          </div>

          <Textarea 
            placeholder="Entrez vos préférences de voyage, une destination, ou une question spécifique..."
            value={input}
            onChange={handleInputChange}
            className="min-h-[200px] border-purple-200"
          />

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleFunction('suggestDestination')}
            disabled={isLoading}
          >
            {isLoading ? 'Recherche en cours...' : 'Planifier mon voyage'}
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
        Note : Les informations fournies sont à titre indicatif. Vérifiez toujours les détails auprès des sources officielles avant de voyager.
      </p>
    </AssistantLayout>
  )
}