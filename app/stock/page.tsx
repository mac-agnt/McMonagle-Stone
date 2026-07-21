import { StockBoard } from "@/components/stock/StockBoard";
import {
  stockOwnRows,
  stockImportRows,
  stockBelowReorder,
  stockTotalTonnesOnHand,
} from "@/lib/mockData";

export default function StockPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <StockBoard
        ownRows={stockOwnRows}
        importRows={stockImportRows}
        belowReorderCount={stockBelowReorder.length}
        totalTonnesOnHand={stockTotalTonnesOnHand}
      />
    </div>
  );
}
