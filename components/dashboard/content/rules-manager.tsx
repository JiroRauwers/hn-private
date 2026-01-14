"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";
import {
	getServerRules,
	createServerRule,
	updateServerRule,
	deleteServerRule,
} from "@/lib/actions/server-content";
import type { ServerRule } from "@/db/schema/server-content";

interface RulesManagerProps {
	serverId: string;
}

export function RulesManager({ serverId }: RulesManagerProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [rules, setRules] = useState<ServerRule[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editingRule, setEditingRule] = useState<ServerRule | null>(null);
	const [formData, setFormData] = useState({
		rule: "",
	});

	useEffect(() => {
		loadRules();
	}, [serverId]);

	const loadRules = async () => {
		setLoading(true);
		const data = await getServerRules(serverId);
		setRules(data);
		setLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (editingRule) {
				await updateServerRule(editingRule.id, formData);
				toast({
					title: "Success",
					description: "Rule updated successfully",
				});
			} else {
				await createServerRule(serverId, formData);
				toast({
					title: "Success",
					description: "Rule created successfully",
				});
			}

			setOpen(false);
			setEditingRule(null);
			setFormData({ rule: "" });
			loadRules();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to save rule",
				variant: "destructive",
			});
		}
	};

	const handleEdit = (rule: ServerRule) => {
		setEditingRule(rule);
		setFormData({ rule: rule.rule });
		setOpen(true);
	};

	const handleDelete = async (ruleId: string) => {
		if (!confirm("Are you sure you want to delete this rule?")) {
			return;
		}

		try {
			await deleteServerRule(ruleId);
			toast({
				title: "Success",
				description: "Rule deleted successfully",
			});
			loadRules();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to delete rule",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground">Server Rules</h2>
					<p className="text-muted-foreground mt-1">
						Define the rules and guidelines for your server
					</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setEditingRule(null);
								setFormData({ rule: "" });
							}}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Rule
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleSubmit}>
							<DialogHeader>
								<DialogTitle>
									{editingRule ? "Edit Rule" : "Add New Rule"}
								</DialogTitle>
								<DialogDescription>
									{editingRule
										? "Update the rule text below"
										: "Add a new rule to your server"}
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="rule">Rule</Label>
									<Textarea
										id="rule"
										value={formData.rule}
										onChange={(e) =>
											setFormData({ ...formData, rule: e.target.value })
										}
										placeholder="Enter rule text"
										required
										rows={3}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit">
									{editingRule ? "Update" : "Create"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{rules.length === 0 ? (
				<Card>
					<CardContent className="p-12">
						<div className="text-center text-muted-foreground">
							No rules added yet. Click "Add Rule" to get started.
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>All Rules ({rules.length})</CardTitle>
						<CardDescription>
							Click on a rule to edit or delete it
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							{rules.map((rule, index) => (
								<li
									key={rule.id}
									className="flex items-start gap-3 group p-3 rounded-lg hover:bg-secondary/20 transition-colors"
								>
									<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
										<CheckCircle2 className="h-4 w-4 text-primary" />
									</div>
									<span className="text-muted-foreground leading-relaxed flex-1">
										{rule.rule}
									</span>
									<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(rule)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(rule.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
