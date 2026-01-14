export default function SearchLoading() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center">
				<div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
				<p className="mt-4 text-muted-foreground">Searching...</p>
			</div>
		</div>
	);
}
