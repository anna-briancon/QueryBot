'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, Search, FileText, BookOpen, HelpCircle, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePDF } from 'react-to-pdf'
import AssistantLayout from '@/components/AssistantLayout'
import FunctionButton from '@/components/FunctionButton'
import OutputDisplay from '@/components/OutputDisplay'

type FunctionType = 'analyzeCase' | 'findLaws' | 'explainLegalConcept' | 'generateLegalSummary' | 'provideLegalAdvice'

export default function LegalEagle() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedArea, setSelectedArea] = useState('general')
  const [currentFunction, setCurrentFunction] = useState<FunctionType>('analyzeCase');

  const { toPDF, targetRef } = usePDF();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const createPrompt = (functionType: FunctionType, input: string) => {
    const areaContext = selectedArea !== 'general' ? `dans le domaine du ${selectedArea}` : ''
    switch (functionType) {
      case 'analyzeCase':
        return `En tant qu'avocat expert ${areaContext}, analysez le cas suivant et fournissez une évaluation juridique préliminaire : "${input}". Formatez votre réponse en Markdown avec des titres et des listes à puces.`
      case 'findLaws':
        return `En tant que juriste spécialisé ${areaContext}, identifiez les principales lois et réglementations françaises pertinentes pour la situation suivante : "${input}". Formatez votre réponse en Markdown avec des titres pour chaque loi et des listes à puces pour les détails.`
      case 'explainLegalConcept':
        return `En tant que professeur de droit ${areaContext}, expliquez le concept juridique suivant de manière claire et concise, comme si vous le présentiez à des étudiants en droit de première année : "${input}". Formatez votre réponse en Markdown avec des titres, des sous-titres et des listes à puces si nécessaire.`
      case 'generateLegalSummary':
        return `En tant qu'assistant juridique ${areaContext}, résumez les points clés juridiques du texte suivant en 3-5 points : "${input}". Formatez votre réponse en Markdown avec des titres et des listes à puces.`
      case 'provideLegalAdvice':
        return `En tant qu'avocat conseil ${areaContext}, fournissez des conseils juridiques généraux pour la situation suivante. Assurez-vous d'inclure un avertissement sur la nécessité de consulter un avocat pour des conseils spécifiques : "${input}". Formatez votre réponse en Markdown avec des titres et des listes à puces.`
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
      analyzeCase: 'Analyse_Cas',
      findLaws: 'Lois_Pertinentes',
      explainLegalConcept: 'Explication_Concept',
      generateLegalSummary: 'Resume_Juridique',
      provideLegalAdvice: 'Conseil_Juridique'
    };
    const truncatedInput = input.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${functionNames[currentFunction]}_${truncatedInput}.pdf`;
  };

  return (
    <AssistantLayout title="LegalEagle - Assistant Juridique" bgColor="bg-blue-100" textColor="text-blue-800">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select onValueChange={setSelectedArea} defaultValue={selectedArea}>
              <SelectTrigger className="w-full sm:w-[200px] border-blue-200">
                <SelectValue placeholder="Sélectionnez un domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="droit_civil">Droit Civil</SelectItem>
                <SelectItem value="droit_penal">Droit Pénal</SelectItem>
                <SelectItem value="droit_du_travail">Droit du Travail</SelectItem>
                <SelectItem value="droit_des_affaires">Droit des Affaires</SelectItem>
                <SelectItem value="droit_immobilier">Droit Immobilier</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <FunctionButton icon={<Scale className="w-4 h-4 mr-2" />} onClick={() => handleFunction('analyzeCase')} disabled={isLoading} borderColor="border-blue-200" hoverBgColor="hover:bg-blue-100">
                Analyser un cas
              </FunctionButton>
              <FunctionButton icon={<Search className="w-4 h-4 mr-2" />} onClick={() => handleFunction('findLaws')} disabled={isLoading} borderColor="border-blue-200" hoverBgColor="hover:bg-blue-100">
                Trouver des lois
              </FunctionButton>
              <FunctionButton icon={<BookOpen className="w-4 h-4 mr-2" />} onClick={() => handleFunction('explainLegalConcept')} disabled={isLoading} borderColor="border-blue-200" hoverBgColor="hover:bg-blue-100">
                Expliquer un concept
              </FunctionButton>
              <FunctionButton icon={<FileText className="w-4 h-4 mr-2" />} onClick={() => handleFunction('generateLegalSummary')} disabled={isLoading} borderColor="border-blue-200" hoverBgColor="hover:bg-blue-100">
                Résumer un texte juridique
              </FunctionButton>
              <FunctionButton icon={<HelpCircle className="w-4 h-4 mr-2" />} onClick={() => handleFunction('provideLegalAdvice')} disabled={isLoading} borderColor="border-blue-200" hoverBgColor="hover:bg-blue-100">
                Obtenir un conseil
              </FunctionButton>
            </div>
          </div>

          <Textarea 
            placeholder="Décrivez votre situation juridique ou posez votre question ici..."
            value={input}
            onChange={handleInputChange}
            className="min-h-[200px] border-blue-200"
          />

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleFunction('analyzeCase')}
            disabled={isLoading}
          >
            {isLoading ? 'Traitement en cours...' : 'Analyser'}
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
        Avertissement : Cet assistant fournit des informations générales et ne remplace pas les conseils d&apos;un avocat qualifié. 
        Pour des conseils juridiques spécifiques, veuillez consulter un professionnel du droit.
      </p>
    </AssistantLayout>
  )
}