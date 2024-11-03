'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Search, FileText, Lightbulb, PenTool, GraduationCap, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePDF } from 'react-to-pdf'
import AssistantLayout from '@/components/AssistantLayout'
import FunctionButton from '@/components/FunctionButton'
import OutputDisplay from '@/components/OutputDisplay'

type FunctionType = 'summarize' | 'findSources' | 'generateBibliography' | 'analyzeArgument' | 'generateThesis' | 'explainConcept'

export default function AcademicAssistant() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDiscipline, setSelectedDiscipline] = useState('general')
  const [currentFunction, setCurrentFunction] = useState<FunctionType>('summarize');
  
  const { toPDF, targetRef } = usePDF();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const createPrompt = (functionType: FunctionType, input: string) => {
    const disciplineContext = selectedDiscipline !== 'general' ? `dans le domaine de ${selectedDiscipline}` : ''
    switch (functionType) {
      case 'summarize':
        return `En tant qu'expert académique ${disciplineContext}, résumez le texte suivant en 3-5 points clés : "${input}". Formatez votre réponse en Markdown avec des titres et des listes à puces.`
      case 'findSources':
        return `En tant que bibliothécaire académique ${disciplineContext}, suggérez 5 sources académiques récentes et pertinentes pour le sujet suivant : "${input}". Fournissez le titre, l'auteur, l'année de publication et un bref résumé pour chaque source. Formatez votre réponse en Markdown avec des titres pour chaque source et des listes à puces pour les détails.`
      case 'generateBibliography':
        return `En tant qu'expert en normes bibliographiques ${disciplineContext}, générez une bibliographie au format APA 7e édition pour les informations suivantes : "${input}". Formatez votre réponse en Markdown.`
      case 'analyzeArgument':
        return `En tant que professeur de logique ${disciplineContext}, analysez l'argument suivant. Identifiez la thèse principale, les prémisses, et évaluez la solidité du raisonnement : "${input}". Formatez votre réponse en Markdown avec des titres pour chaque section de l'analyse.`
      case 'generateThesis':
        return `En tant que directeur de thèse ${disciplineContext}, proposez une déclaration de thèse convaincante et trois arguments principaux pour le sujet suivant : "${input}". Formatez votre réponse en Markdown avec des titres et des listes à puces.`
      case 'explainConcept':
        return `En tant que professeur universitaire ${disciplineContext}, expliquez le concept suivant de manière claire et concise, comme si vous le présentiez à des étudiants de premier cycle : "${input}". Formatez votre réponse en Markdown avec des titres, des sous-titres et des listes à puces si nécessaire.`
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
      summarize: 'Resume',
      findSources: 'Sources',
      generateBibliography: 'Bibliographie',
      analyzeArgument: 'Analyse_Argument',
      generateThesis: 'These',
      explainConcept: 'Explication_Concept'
    };
    const truncatedInput = input.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${functionNames[currentFunction]}_${truncatedInput}.pdf`;
  };

  return (
    <AssistantLayout title="Assistant Académique" bgColor="bg-yellow-100" textColor="text-yellow-800">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select onValueChange={setSelectedDiscipline} defaultValue={selectedDiscipline}>
              <SelectTrigger className="w-full sm:w-[200px] border-yellow-200">
                <SelectValue placeholder="Sélectionnez une discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="sciences_humaines">Sciences Humaines</SelectItem>
                <SelectItem value="sciences_naturelles">Sciences Naturelles</SelectItem>
                <SelectItem value="sciences_sociales">Sciences Sociales</SelectItem>
                <SelectItem value="ingenierie">Ingénierie</SelectItem>
                <SelectItem value="medecine">Médecine</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <FunctionButton icon={<BookOpen className="w-4 h-4 mr-2" />} onClick={() => handleFunction('summarize')} disabled={isLoading} borderColor="border-yellow-200" hoverBgColor="hover:bg-yellow-100">
                Résumer
              </FunctionButton>
              <FunctionButton icon={<Search className="w-4 h-4 mr-2" />} onClick={() => handleFunction('findSources')} disabled={isLoading} borderColor="border-yellow-200" hoverBgColor="hover:bg-yellow-100">
                Trouver des sources
              </FunctionButton>
              <FunctionButton icon={<FileText className="w-4 h-4 mr-2" />} onClick={() => handleFunction('generateBibliography')} disabled={isLoading} borderColor="border-yellow-200" hoverBgColor="hover:bg-yellow-100">
                Générer une bibliographie
              </FunctionButton>
              <FunctionButton icon={<Lightbulb className="w-4 h-4 mr-2" />} onClick={() => handleFunction('analyzeArgument')} disabled={isLoading} borderColor="border-yellow-200" hoverBgColor="hover:bg-yellow-100">
                Analyser un argument
              </FunctionButton>
              <FunctionButton icon={<PenTool className="w-4 h-4 mr-2" />} onClick={() => handleFunction('generateThesis')} disabled={isLoading} borderColor="border-yellow-200" hoverBgColor="hover:bg-yellow-100">
                Générer une thèse
              </FunctionButton>
              <FunctionButton icon={<GraduationCap className="w-4 h-4 mr-2" />} onClick={() => handleFunction('explainConcept')} disabled={isLoading} borderColor="border-yellow-200" hoverBgColor="hover:bg-yellow-100">
                Expliquer un concept
              </FunctionButton>
            </div>
          </div>

          <Textarea 
            placeholder="Entrez votre texte, question ou sujet académique ici..."
            value={input}
            onChange={handleInputChange}
            className="min-h-[200px] border-yellow-200"
          />

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => handleFunction('summarize')}
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
        Avertissement : Cet assistant fournit des informations générales à des fins éducatives. 
        Pour des conseils académiques spécifiques, veuillez consulter vos professeurs ou tuteurs.
      </p>
    </AssistantLayout>
  )
}