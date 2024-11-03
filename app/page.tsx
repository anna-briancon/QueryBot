import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Scale, Utensils, Leaf, Plane, Dumbbell } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-12 text-black">
          QueryBot
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AssistantCard 
            title="StudyBuddy"
            description="Votre compagnon pour la recherche et la rédaction académique"
            icon={<GraduationCap className="w-8 h-8 text-yellow-500" />}
            color="bg-yellow-100"
            link="/StudyBuddy"
          />
          <AssistantCard 
            title="LegalEagle"
            description="Votre assistant juridique virtuel pour le droit français"
            icon={<Scale className="w-8 h-8 text-blue-500" />}
            color="bg-blue-100"
            link="/LegalEagle"
          />
          <AssistantCard 
            title="RecipeMaster"
            description="Votre assistant culinaire pour des recettes et des conseils de cuisine"
            icon={<Utensils className="w-8 h-8 text-red-500" />}
            color="bg-red-100"
            link="/RecipeMaster"
          />
          <AssistantCard 
            title="EcoExplorer"
            description="Votre guide pour des solutions écologiques et durables"
            icon={<Leaf className="w-8 h-8 text-green-500" />}
            color="bg-green-100"
            link="/EcoExplorer"
          />
          <AssistantCard 
            title="TravelScout"
            description="Votre compagnon de planification de voyage"
            icon={<Plane className="w-8 h-8 text-purple-500" />}
            color="bg-purple-100"
            link="/TravelScout"
          />
          <AssistantCard 
            title="FitnessFinder"
            description="Votre coach personnel pour des programmes d'entraînement et conseils de fitness"
            icon={<Dumbbell className="w-8 h-8 text-orange-500" />}
            color="bg-orange-100"
            link="/FitnessFinder"
          />
        </div>
      </div>
    </div>
  )
}

interface AssistantCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  link: string
}

function AssistantCard({ title, description, icon, color, link }: AssistantCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 border-t-4 border-t-primary">
      <div className={`${color} p-4 flex justify-center items-center`}>
        {icon}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={link}>Accéder à {title}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}