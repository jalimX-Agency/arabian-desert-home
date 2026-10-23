"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AvailabilityCalendar } from "./_components/AvailabilityCalendar";
import { TarifsTab } from "./_components/TarifsTab";
import { FermeturesTab } from "./_components/FermeturesTab";

export default function TarifsSaisonniersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Tarifs & Fermetures</h1>

      <Tabs defaultValue="calendrier">
        <TabsList className="mb-2">
          <TabsTrigger value="calendrier" className="cursor-pointer">Calendrier</TabsTrigger>
          <TabsTrigger value="tarifs" className="cursor-pointer">Liste des tarifs</TabsTrigger>
          <TabsTrigger value="fermetures" className="cursor-pointer">Liste des fermetures</TabsTrigger>
        </TabsList>
        <TabsContent value="calendrier">
          <AvailabilityCalendar />
        </TabsContent>
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
