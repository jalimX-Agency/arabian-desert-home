"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TarifsTab } from "./_components/TarifsTab";
import { FermeturesTab } from "./_components/FermeturesTab";

export default function TarifsSaisonniersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Tarifs & Fermetures</h1>

      <Tabs defaultValue="tarifs">
        <TabsList className="mb-2">
          <TabsTrigger value="tarifs" className="cursor-pointer">Tarifs saisonniers</TabsTrigger>
          <TabsTrigger value="fermetures" className="cursor-pointer">Fermetures</TabsTrigger>
        </TabsList>
        <TabsContent value="tarifs">
          <TarifsTab />
        </TabsContent>
        <TabsContent value="fermetures">
          <FermeturesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
