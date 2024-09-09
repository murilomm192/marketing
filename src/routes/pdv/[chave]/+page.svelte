<script>
  import { page } from "$app/stores";

  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";

  // TODO: Replace this with actual data fetching logic
  let pdvDetails = {
    name: "PDV Example",
    address: "123 Example Street, City, State",
    phone: "(123) 456-7890",
    email: "pdv@example.com",
  };
</script>

<div class="container mx-auto p-4">
  <Card>
    <CardHeader>
      <CardTitle>{JSON.stringify($page.params.chave)}</CardTitle>
      <CardDescription>PDV Details</CardDescription>
    </CardHeader>
    <CardContent>
      <p><strong>Address:</strong> {JSON.stringify($page)}</p>
      <p><strong>Phone:</strong> {pdvDetails.phone}</p>
      <p><strong>Email:</strong> {pdvDetails.email}</p>
    </CardContent>
    <CardFooter>
      <Button href="/mapa">Voltar ao Mapa</Button>
    </CardFooter>
  </Card>
</div>
