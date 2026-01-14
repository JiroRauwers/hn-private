import { notFound } from "next/navigation";
import { EditServerForm } from "@/components/dashboard/edit-server-form";
import { getServerById } from "@/lib/actions/servers";

export default async function EditServerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const server = await getServerById((await params).id);

	if (!server) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Edit Server</h1>
				<p className="text-muted-foreground">
					Update your server's information
				</p>
			</div>

			<EditServerForm server={server} />
		</div>
	);
}
