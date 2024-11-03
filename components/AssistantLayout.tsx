import React, { ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"
import Link from 'next/link'

interface AssistantLayoutProps {
  title: string
  children: ReactNode
  bgColor: string
  textColor: string
}

export default function AssistantLayout({ title, children, bgColor, textColor }: AssistantLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className={`flex justify-between items-center ${bgColor} p-4 rounded-lg shadow-md mt-4`}>
            <h1 className={`text-3xl font-bold ${textColor}`}>{title}</h1>
            <Button variant="outline" asChild className="bg-white hover:bg-gray-100 border-black">
              <Link href="/" className="flex items-center">
                <House className="w-3 h-3 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 space-y-6 pt-24">
        {children}
      </div>
    </div>
  )
}