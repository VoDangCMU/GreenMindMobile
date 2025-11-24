import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/store/todoStore";
import {
    ChevronDown,
    ChevronRight,
    Trash2,
    Plus,
    CheckCircle2,
    Circle,
    Wand2,
    Loader2,
} from "lucide-react";

export type TodoItemProps = {
    item: Todo;
    level: number;
    onToggle: (id: string) => void;
    onToggleExpand: (id: string) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string, text: string) => void;
    onGenerateSubtasks: (parentId: string, todoTitle: string) => void;
    editingParentId: string | null;
    newChildText: string;
    setNewChildText: (text: string) => void;
    setEditingParentId: (id: string | null) => void;
    expandedIds: Set<string>;
    setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    generatingIds?: Set<string>;
};

export function TodoItemComponent({
    item,
    level,
    onToggle,
    onToggleExpand,
    onDelete,
    onAddChild,
    onGenerateSubtasks,
    editingParentId,
    newChildText,
    setNewChildText,
    setEditingParentId,
    expandedIds,
    setExpandedIds,
    generatingIds,
}: TodoItemProps) {
    const paddingLeft = level * 16;

    const countTotalChildren = (node: Todo): number => {
        return node.children.length + node.children.reduce((sum: number, child: Todo) => sum + countTotalChildren(child), 0);
    };

    const countCompletedChildren = (node: Todo): number => {
        const completed = node.children.filter((child: Todo) => child.completed).length;
        const childrenCompleted = node.children.reduce((sum: number, child: Todo) => sum + countCompletedChildren(child), 0);
        return completed + childrenCompleted;
    };

    const totalChildren = countTotalChildren(item);
    const completedChildren = countCompletedChildren(item);

    return (
        <div key={item.id} className="space-y-2">
            {/* Todo Item Card */}
            <Card
                className="border-0 shadow-sm hover:shadow-md transition"
                style={{ marginLeft: `${paddingLeft}px` }}
            >
                <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <button
                            onClick={() => onToggle(item.id)}
                            className="flex-shrink-0"
                            style={{
                                color: level === 0 ? "#15803d" : "#3b82f6",
                            }}
                        >
                            {item.completed ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                <Circle className="w-5 h-5" />
                            )}
                        </button>

                        {/* Todo Text */}
                        <div className="flex-1 min-w-0">
                            <p
                                className={`text-sm font-medium break-words ${item.completed
                                        ? "line-through text-gray-400"
                                        : "text-gray-800"
                                    }`}
                            >
                                {item.title}
                            </p>
                            {totalChildren > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {completedChildren}/{totalChildren} items
                                </p>
                            )}
                        </div>

                        {/* Expand/Collapse Button */}
                        {item.children.length > 0 && (
                            <button
                                onClick={() => onToggleExpand(item.id)}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                            >
                                {expandedIds.has(item.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        )}

                        {/* Add Sub-Todo Button */}
                        <button
                            onClick={() => {
                                if (!expandedIds.has(item.id)) {
                                    setExpandedIds(prev => new Set(prev).add(item.id));
                                }
                                setEditingParentId(item.id);
                            }}
                            className="flex-shrink-0 text-blue-400 hover:text-blue-600"
                            title="Add sub-todo"
                        >
                            <Plus className="w-4 h-4" />
                        </button>

                        {/* AI Generate Button */}
                        <button
                            onClick={() => onGenerateSubtasks(item.id, item.title)}
                            className={`flex-shrink-0 ${generatingIds?.has(item.id) ? 'text-purple-600' : 'text-purple-400 hover:text-purple-600'}`}
                            title="Generate AI subtasks"
                            disabled={generatingIds?.has(item.id)}
                        >
                            {generatingIds?.has(item.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Wand2 className="w-4 h-4" />
                            )}
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => onDelete(item.id)}
                            className="flex-shrink-0 text-red-400 hover:text-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Children - Expanded */}
            {expandedIds.has(item.id) && item.children.length > 0 && (
                <div className="space-y-2">
                    {item.children.map((child: Todo) => (
                        <TodoItemComponent
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onToggle={onToggle}
                            onToggleExpand={onToggleExpand}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                            onGenerateSubtasks={onGenerateSubtasks}
                            editingParentId={editingParentId}
                            newChildText={newChildText}
                            setNewChildText={setNewChildText}
                            setEditingParentId={setEditingParentId}
                            expandedIds={expandedIds}
                            setExpandedIds={setExpandedIds}
                            generatingIds={generatingIds}
                        />
                    ))}
                </div>
            )}

            {/* Add Child Todo - Show when expanded */}
            {expandedIds.has(item.id) && (
                <div style={{ marginLeft: `${paddingLeft + 16}px` }}>
                    <Card className="shadow-sm border border-dashed border-gray-300">
                        <CardContent className="p-3">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add sub-todo..."
                                    value={editingParentId === item.id ? newChildText : ""}
                                    onChange={(e) => setNewChildText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            onAddChild(item.id, newChildText);
                                            setNewChildText("");
                                            setEditingParentId(null);
                                        }
                                    }}
                                    onFocus={() => setEditingParentId(item.id)}
                                    className="text-sm"
                                />
                                <Button
                                    onClick={() => {
                                        onAddChild(item.id, newChildText);
                                        setNewChildText("");
                                        setEditingParentId(null);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
