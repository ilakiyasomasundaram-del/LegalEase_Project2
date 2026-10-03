import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.document.count();
  if (count > 0) return;

  await prisma.document.createMany({
    data: [
      {
        title: "Sample Rental Agreement",
        type: "rental",
        inputData: JSON.stringify({ landlordName:"Arun Kumar", tenantName:"Rahul", propertyAddress:"Chennai, Tamil Nadu", monthlyRent:"₹15,000" }),
        content: "SAMPLE RENTAL AGREEMENT\n\nThis is a sample document created by LegalEase for demonstration purposes.\n\nLandlord: Arun Kumar\nTenant: Rahul\nProperty: Chennai, Tamil Nadu\nMonthly Rent: ₹15,000\n\nDISCLAIMER: This is an informational sample and should be reviewed by a qualified legal professional.",
        status: "COMPLETED"
      },
      {
        title: "Sample Non-Disclosure Agreement",
        type: "nda",
        inputData: JSON.stringify({ disclosingParty:"ABC Technologies", receivingParty:"Demo Partner", purpose:"Confidential business discussions" }),
        content: "SAMPLE NON-DISCLOSURE AGREEMENT\n\nDisclosing Party: ABC Technologies\nReceiving Party: Demo Partner\nPurpose: Confidential business discussions\n\nDISCLAIMER: This is an informational sample and should be reviewed by a qualified legal professional.",
        status: "COMPLETED"
      }
    ]
  });
}

main().finally(() => prisma.$disconnect());