import { useEffect, useState, type FC } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Tag,
  X,
  Check,
  LayoutGrid,
  List,
  Columns3,
} from "lucide-react";
import { EmptyState } from "../../UI/EmptyState/EmptyState";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  createCatalogApi,
  deleteCatalogApi,
  setCurrentCatalogID,
  toggleisOpenCatalogEditForm,
  TypeCatalog,
  type categoryItem,
  type categoryState,
} from "../../../stores/catalogSlice/catalogsSlice";
import { createTagApi, deleteTagApi, type TagEntity } from "../../../stores/tagSlice/tagSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Loader } from "../../UI/Loader/Loader";
import { CatalogEditForm } from "./CatalogEditForm/CatalogEditForm";

type ViewMode = "grid-4" | "grid-2" | "list";

interface CatalogItemDef {
  id: TypeCatalog;
  title: string;
  value: string;
  color: string;
  listName: keyof categoryState;
  icon: React.ReactNode;
  accent: string;
  onCreate: (x: { value: string; type: TypeCatalog }) => void;
}

/* ─── Detail Item ─── */
const CatalogDetailItem: FC<{ catalog: categoryItem; x: CatalogItemDef; compact?: boolean }> = ({ catalog, x, compact }) => {
  const dispatch = useAppDispatch();

  if (compact) {
    return (
      <div className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-primary-700/15">
        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded opacity-20 blur-[1px]" style={{ backgroundColor: catalog.color || "#5a3a4a" }} />
          <div className="relative h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: catalog.color || "#5a3a4a" }} />
        </div>
        <span className="flex-1 truncate text-xs text-grey-100">{catalog.label}</span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="flex h-6 w-6 items-center justify-center rounded text-grey-200/50 hover:bg-primary-700/30 hover:text-grey-0"
            onClick={() => { dispatch(setCurrentCatalogID(catalog.value)); dispatch(toggleisOpenCatalogEditForm(true)); }}
          ><Pencil size={11} /></button>
          <button
            className="flex h-6 w-6 items-center justify-center rounded text-grey-200/50 hover:bg-red-500/15 hover:text-red-400"
            onClick={() => dispatch(deleteCatalogApi({ id: catalog.value, type: x.id }))}
          ><Trash2 size={11} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary-700/15">
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
        <div className="absolute inset-0 rounded-lg opacity-20 blur-[2px]" style={{ backgroundColor: catalog.color || "#5a3a4a" }} />
        <div className="relative h-3.5 w-3.5 rounded-md" style={{ backgroundColor: catalog.color || "#5a3a4a" }} />
      </div>
      <span className="flex-1 text-sm text-grey-100">{catalog.label}</span>
      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/60 transition-colors hover:bg-primary-700/30 hover:text-grey-0"
          onClick={() => { dispatch(setCurrentCatalogID(catalog.value)); dispatch(toggleisOpenCatalogEditForm(true)); }}
        ><Pencil size={13} /></button>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/60 transition-colors hover:bg-red-500/15 hover:text-red-400"
          onClick={() => dispatch(deleteCatalogApi({ id: catalog.value, type: x.id }))}
        ><Trash2 size={13} /></button>
      </div>
    </div>
  );
};

/* ─── Card ─── */
const CatalogCard: FC<{
  item: CatalogItemDef;
  onChange: (value: string) => void;
  catalogs: categoryState;
  viewMode: ViewMode;
}> = ({ item: x, onChange, catalogs, viewMode }) => {
  const [isAdding, setIsAdding] = useState(false);
  const list = Array.isArray(catalogs[x.listName]) ? (catalogs[x.listName] as categoryItem[]) : [];
  const isCompact = viewMode === "grid-4";

  return (
    <div className="animate-fade-in-up app-surface-strong flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`flex items-center gap-3 ${isCompact ? "p-4 pb-2" : "p-5 pb-3"}`}>
        <div className={`flex shrink-0 items-center justify-center rounded-xl ${x.accent} ${isCompact ? "h-8 w-8" : "h-10 w-10"}`}>
          {x.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-grey-0 ${isCompact ? "text-xs" : "text-sm"}`}>{x.title}</h3>
          <p className="text-[10px] text-grey-200/50 mt-0.5">
            {list.length} {list.length === 1 ? "элемент" : list.length < 5 ? "элемента" : "элементов"}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`flex items-center justify-center rounded-xl bg-primary-500/15 text-primary-400 transition-all duration-200 hover:bg-primary-500/25 hover:shadow-glow-sm ${isCompact ? "h-7 w-7" : "h-8 w-8"}`}
        >
          <Plus size={isCompact ? 14 : 16} />
        </button>
      </div>

      {/* Add form */}
      {isAdding && (
        <div className={`mx-3 mb-2 flex items-center gap-2 rounded-xl border border-primary-700/30 bg-primary-800/40 p-1.5 animate-scale-in ${isCompact ? "mx-3" : "mx-5 mb-3 p-2"}`}>
          <input
            autoFocus
            className="flex-1 bg-transparent px-2 py-1 text-xs text-grey-0 placeholder:text-grey-200/40 outline-none"
            placeholder="Название..."
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { x.onCreate({ value: x.value, type: x.id }); setIsAdding(false); }
              if (e.key === "Escape") setIsAdding(false);
            }}
          />
          <button onClick={() => { x.onCreate({ value: x.value, type: x.id }); setIsAdding(false); }}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30">
            <Check size={12} />
          </button>
          <button onClick={() => setIsAdding(false)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-grey-200/50 hover:bg-primary-700/30 hover:text-grey-0">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Items */}
      <div className={`flex-1 ${isCompact ? "px-2 pb-2" : "px-3 pb-3"}`}>
        {list.length === 0 ? (
          <EmptyState icon={x.icon} compact />
        ) : (
          <ul className="flex flex-col gap-px">
            {list.map((catalog) => (
              <CatalogDetailItem catalog={catalog} x={x} key={catalog.value} compact={isCompact} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ─── List Row (for list view) ─── */
const CatalogListRow: FC<{
  item: CatalogItemDef;
  onChange: (value: string) => void;
  catalogs: categoryState;
}> = ({ item: x, onChange, catalogs }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const list = Array.isArray(catalogs[x.listName]) ? (catalogs[x.listName] as categoryItem[]) : [];

  return (
    <div className="animate-fade-in-up app-surface-strong overflow-hidden">
      {/* Row header */}
      <div className="flex items-center gap-3 px-5 py-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${x.accent}`}>
          {x.icon}
        </div>
        <h3 className="flex-1 text-sm font-semibold text-grey-0">{x.title}</h3>
        <span className="rounded-full bg-primary-700/30 px-2.5 py-0.5 text-[10px] font-medium text-grey-200/60">
          {list.length}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/15 text-primary-400 hover:bg-primary-500/25"
        >
          <Plus size={14} />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-primary-700/20 px-3 pb-3 pt-1">
          {isAdding && (
            <div className="mx-2 mb-2 flex items-center gap-2 rounded-xl border border-primary-700/30 bg-primary-800/40 p-1.5 animate-scale-in">
              <input autoFocus className="flex-1 bg-transparent px-2 py-1 text-xs text-grey-0 placeholder:text-grey-200/40 outline-none"
                placeholder="Название..." onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { x.onCreate({ value: x.value, type: x.id }); setIsAdding(false); }
                  if (e.key === "Escape") setIsAdding(false);
                }}
              />
              <button onClick={() => { x.onCreate({ value: x.value, type: x.id }); setIsAdding(false); }}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400"><Check size={12} /></button>
              <button onClick={() => setIsAdding(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-grey-200/50 hover:text-grey-0"><X size={12} /></button>
            </div>
          )}
          {list.length === 0 ? (
            <EmptyState icon={x.icon} compact />
          ) : (
            <div className="flex flex-wrap gap-1.5 px-2">
              {list.map((catalog) => (
                <CatalogDetailItem catalog={catalog} x={x} key={catalog.value} compact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── View Switcher ─── */
const ViewSwitcher: FC<{ mode: ViewMode; onChange: (m: ViewMode) => void }> = ({ mode, onChange }) => {
  const views: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: "grid-4", icon: <LayoutGrid size={15} />, label: "4 столбца" },
    { id: "grid-2", icon: <Columns3 size={15} />, label: "2 столбца" },
    { id: "list", icon: <List size={15} />, label: "Список" },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-primary-700/30 bg-primary-800/30 p-0.5">
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          title={v.label}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
            mode === v.id
              ? "bg-primary-500/20 text-primary-400 shadow-glow-sm"
              : "text-grey-200/40 hover:text-grey-200/70",
          ].join(" ")}
        >
          {v.icon}
        </button>
      ))}
    </div>
  );
};

/* ─── Tags Card ─── */
const TagsCard: FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  const dispatch = useAppDispatch();
  const tags = useAppSelector((st) => st.tags.tags);
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const isCompact = viewMode === "grid-4";

  const handleCreate = () => {
    if (newTagName.trim()) {
      dispatch(createTagApi({ name: newTagName.trim() }));
      setNewTagName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="animate-fade-in-up app-surface-strong flex flex-col overflow-hidden">
      <div className={`flex items-center gap-3 ${isCompact ? "p-4 pb-2" : "p-5 pb-3"}`}>
        <div className={`flex shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 ${isCompact ? "h-8 w-8" : "h-10 w-10"}`}>
          <Tag size={isCompact ? 14 : 18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-grey-0 ${isCompact ? "text-xs" : "text-sm"}`}>Теги</h3>
          <p className="text-[10px] text-grey-200/50 mt-0.5">
            {tags.length} {tags.length === 1 ? "тег" : tags.length < 5 ? "тега" : "тегов"}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`flex items-center justify-center rounded-xl bg-primary-500/15 text-primary-400 transition-all duration-200 hover:bg-primary-500/25 hover:shadow-glow-sm ${isCompact ? "h-7 w-7" : "h-8 w-8"}`}
        >
          <Plus size={isCompact ? 14 : 16} />
        </button>
      </div>

      {isAdding && (
        <div className={`mx-3 mb-2 flex items-center gap-2 rounded-xl border border-primary-700/30 bg-primary-800/40 p-1.5 animate-scale-in ${isCompact ? "mx-3" : "mx-5 mb-3 p-2"}`}>
          <input
            autoFocus
            className="flex-1 bg-transparent px-2 py-1 text-xs text-grey-0 placeholder:text-grey-200/40 outline-none"
            placeholder="Название тега..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setIsAdding(false);
            }}
          />
          <button onClick={handleCreate}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30">
            <Check size={12} />
          </button>
          <button onClick={() => setIsAdding(false)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-grey-200/50 hover:bg-primary-700/30 hover:text-grey-0">
            <X size={12} />
          </button>
        </div>
      )}

      <div className={`flex-1 ${isCompact ? "px-2 pb-2" : "px-3 pb-3"}`}>
        {tags.length === 0 ? (
          <EmptyState icon={<Tag size={18} />} compact />
        ) : (
          <ul className="flex flex-col gap-px">
            {tags.map((tag: TagEntity) => (
              <div key={tag.id} className={`group flex items-center gap-${isCompact ? "2" : "3"} rounded-${isCompact ? "lg" : "xl"} px-${isCompact ? "2" : "3"} py-${isCompact ? "1.5" : "2.5"} transition-all duration-200 hover:bg-primary-700/15`}>
                <div className={`relative flex ${isCompact ? "h-5 w-5" : "h-7 w-7"} shrink-0 items-center justify-center`}>
                  <div className="absolute inset-0 rounded-lg opacity-20 blur-[2px]" style={{ backgroundColor: tag.color || "#5a3a4a" }} />
                  <div className={`relative ${isCompact ? "h-2.5 w-2.5 rounded-sm" : "h-3.5 w-3.5 rounded-md"}`} style={{ backgroundColor: tag.color || "#5a3a4a" }} />
                </div>
                <span className={`flex-1 ${isCompact ? "truncate text-xs" : "text-sm"} text-grey-100`}>{tag.name}</span>
                <div className={`flex items-center gap-${isCompact ? "0.5" : "1"} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}>
                  <button
                    className={`flex ${isCompact ? "h-6 w-6" : "h-7 w-7"} items-center justify-center rounded-lg text-grey-200/60 transition-colors hover:bg-red-500/15 hover:text-red-400`}
                    onClick={() => dispatch(deleteTagApi(tag.id))}
                  ><Trash2 size={isCompact ? 11 : 13} /></button>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ─── Main ─── */
export const Catalog = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((st) => st.catalogs.isLoading);
  const tagsLoading = useAppSelector((st) => st.tags.isLoading);
  const catalogs = useAppSelector((st) => st.catalogs);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const createHandler = (x: { value: string; type: TypeCatalog }) => {
    dispatch(createCatalogApi({ catalogName: x.value, catalogType: x.type, catalogColor: "" }));
  };

  const [items, setItem] = useState<CatalogItemDef[]>([
    { id: TypeCatalog.exp, title: "Расходы", value: "", color: "", listName: "categoryExpList", icon: <ShoppingBag size={18} />, accent: "bg-red-500/15 text-red-400", onCreate: createHandler },
    { id: TypeCatalog.inc, title: "Источники дохода", value: "", color: "", listName: "typeInc", icon: <TrendingUp size={18} />, accent: "bg-green-500/15 text-green-400", onCreate: createHandler },
    { id: TypeCatalog.pay, title: "Счета", value: "", color: "", listName: "methodInc", icon: <CreditCard size={18} />, accent: "bg-accent-500/15 text-accent-400", onCreate: createHandler },
  ]);

  useEffect(() => { console.log(isLoading); }, [isLoading]);

  const gridClass =
    viewMode === "grid-4" ? "grid grid-cols-2 gap-3 lg:grid-cols-4"
    : viewMode === "grid-2" ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
    : "flex flex-col gap-3";

  return (
    <>
      <ContentHeader
        title="Каталог"
        subtitle="Управляйте категориями расходов, доходов и способов оплаты"
      >
        <ViewSwitcher mode={viewMode} onChange={setViewMode} />
      </ContentHeader>
      <ContentMain>
        <div className={`${gridClass} pb-6`}>
          {items.map((x) =>
            viewMode === "list" ? (
              <CatalogListRow key={x.id} catalogs={catalogs} item={x} onChange={(value) => setItem((prev) => prev.map((item) => item.id === x.id ? { ...x, value } : item))} />
            ) : (
              <CatalogCard key={x.id} catalogs={catalogs} item={x} viewMode={viewMode} onChange={(value) => setItem((prev) => prev.map((item) => item.id === x.id ? { ...x, value } : item))} />
            )
          )}
          <TagsCard viewMode={viewMode} />
        </div>
      </ContentMain>
      <Loader isLoading={isLoading || tagsLoading} />
      <CatalogEditForm isOpen={catalogs.isOpenCatalogEditForm} onClose={() => dispatch(toggleisOpenCatalogEditForm(false))} />
    </>
  );
};
