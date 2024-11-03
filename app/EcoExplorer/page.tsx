'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Recycle, Zap, Droplet, Wind, HelpCircle, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePDF } from 'react-to-pdf'
import AssistantLayout from '@/components/AssistantLayout'
import FunctionButton from '@/components/FunctionButton'
import OutputDisplay from '@/components/OutputDisplay'

type FunctionType = 'findEcoSolution' | 'calculateFootprint' | 'suggestAlternatives' | 'explainConcept' | 'findLocalInitiatives' | 'compareProducts'

export default function EcoExplorer() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('general')
  const [currentFunction, setCurrentFunction] = useState<FunctionType>('findEcoSolution')

  const { toPDF, targetRef } = usePDF();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const createPrompt = (functionType: FunctionType, input: string) => {
    const domainContext = selectedDomain !== 'general' ? `dans le domaine de ${selectedDomain}` : ''
    switch (functionType) {
      case 'findEcoSolution':
        return `En tant qu'expert en développement durable ${domainContext}, suggérez une solution écologique pour le problème suivant : "${input}". Détaillez la mise en œuvre et les avantages environnementaux. Formatez votre réponse en Markdown avec des titres, des sous-titres et des listes à puces.`
      case 'calculateFootprint':
        return `Estimez l'empreinte carbone approximative pour l'activité ou le produit suivant ${domainContext} : "${input}". Expliquez le calcul et suggérez des moyens de réduction. Formatez votre réponse en Markdown avec un tableau pour les calculs et des listes à puces pour les suggestions.`
      case 'suggestAlternatives':
        return `Proposez des alternatives écologiques ${domainContext} pour : "${input}". Comparez leur impact environnemental avec l'option originale. Formatez votre réponse en Markdown avec des titres pour chaque alternative et des listes à puces pour les comparaisons.`
      case 'explainConcept':
        return `Expliquez le concept écologique suivant ${domainContext} de manière simple et concise : "${input}". Incluez son importance et des exemples concrets. Formatez votre réponse en Markdown avec des titres, des sous-titres et des listes à puces.`
      case 'findLocalInitiatives':
        return `Décrivez des types d'initiatives locales qui pourraient être mises en place ${domainContext} pour adresser le problème suivant : "${input}". Donnez des exemples de mise en œuvre réussie. Formatez votre réponse en Markdown avec des titres pour chaque initiative et des listes à puces pour les détails.`
      case 'compareProducts':
        return `Comparez l'impact environnemental des produits ou pratiques suivants ${domainContext} : "${input}". Fournissez une analyse détaillée et des recommandations. Formatez votre réponse en Markdown avec un tableau comparatif et des listes à puces pour les recommandations.`
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
      findEcoSolution: 'Solution_Ecologique',
      calculateFootprint: 'Empreinte_Carbone',
      suggestAlternatives: 'Alternatives_Ecologiques',
      explainConcept: 'Concept_Ecologique',
      findLocalInitiatives: 'Initiatives_Locales',
      compareProducts: 'Comparaison_Produits'
    };
    const truncatedInput = input.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${functionNames[currentFunction]}_${truncatedInput}.pdf`;
  };

  return (
    <AssistantLayout title="EcoExplorer - Solutions Durables" bgColor="bg-green-100" textColor="text-green-800">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select onValueChange={setSelectedDomain} defaultValue={selectedDomain}>
              <SelectTrigger className="w-full sm:w-[200px] border-green-200">
                <SelectValue placeholder="Sélectionnez un domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="energie">Énergie</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="alimentation">Alimentation</SelectItem>
                <SelectItem value="dechets">Gestion des déchets</SelectItem>
                <SelectItem value="habitat">Habitat</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <FunctionButton icon={<Leaf className="w-4 h-4 mr-2" />} onClick={() => handleFunction('findEcoSolution')} disabled={isLoading} borderColor="border-green-200" hoverBgColor="hover:bg-green-100">
                Trouver une solution
              </FunctionButton>
              <FunctionButton icon={<Zap className="w-4 h-4 mr-2" />} onClick={() => handleFunction('calculateFootprint')} disabled={isLoading} borderColor="border-green-200" hoverBgColor="hover:bg-green-100">
                Calculer l&apos;empreinte
              </FunctionButton>
              <FunctionButton icon={<Recycle className="w-4 h-4 mr-2" />} onClick={() => handleFunction('suggestAlternatives')} disabled={isLoading} borderColor="border-green-200" hoverBgColor="hover:bg-green-100">
                Suggérer des alternatives
              </FunctionButton>
              <FunctionButton icon={<HelpCircle className="w-4 h-4 mr-2" />} onClick={() => handleFunction('explainConcept')} disabled={isLoading} borderColor="border-green-200" hoverBgColor="hover:bg-green-100">
                Expliquer un concept
              </FunctionButton>
              <FunctionButton icon={<Droplet className="w-4 h-4 mr-2" />} onClick={() => handleFunction('findLocalInitiatives')} disabled={isLoading} borderColor="border-green-200" hoverBgColor="hover:bg-green-100">
                Initiatives locales
              </FunctionButton>
              <FunctionButton icon={<Wind className="w-4 h-4 mr-2" />} onClick={() => handleFunction('compareProducts')} disabled={isLoading} borderColor="border-green-200" hoverBgColor="hover:bg-green-100">
                Comparer des produits
              </FunctionButton>
            </div>
          </div>

          <Textarea 
            placeholder="Entrez votre question sur l'écologie, un problème environnemental ou un produit à évaluer..."
            value={input}
            onChange={handleInputChange}
            className="min-h-[200px] border-green-200"
          />

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleFunction('findEcoSolution')}
            disabled={isLoading}
          >
            {isLoading ? 'Recherche en cours...' : 'Explorer des solutions durables'}
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
        Note : Les informations fournies sont à titre indicatif. Pour des solutions précises, consultez un expert en développement durable.
      </p>
    </AssistantLayout>
  )
}