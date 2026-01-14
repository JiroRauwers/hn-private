import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Column {
	key: string;
	header: string;
}

interface LegalTableProps {
	columns: Column[];
	data: Record<string, string>[];
}

export function LegalTable({ columns, data }: LegalTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.key} className="font-semibold">
								{column.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row, index) => (
						<TableRow key={index}>
							{columns.map((column) => (
								<TableCell key={column.key}>{row[column.key]}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
