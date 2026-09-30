import React from 'react';
import { KpiMetricsBar } from './KpiMetricsBar';
import { KanbanDispatchBoard } from './KanbanDispatchBoard';
import { InventoryLivePanel } from './InventoryLivePanel';
import { useCatalog } from '../../hooks/useCatalog';
import { useOrders } from '../../hooks/useOrders';

export const StaffDashboard: React.FC = () => {
  const { products, adjustStock, replenishStock } = useCatalog('todos');
  const {
    prepOrders,
    readyOrders,
    deliveredCount,
    updateStatus,
    deliverOrder,
    simulateIncoming
  } = useOrders();

  const criticalCount = products.filter(p => p.stock <= 3).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Operational Metrics */}
      <KpiMetricsBar
        prepCount={prepOrders.length}
        readyCount={readyOrders.length}
        deliveredCount={deliveredCount}
        criticalCount={criticalCount}
      />

      {/* Main Operational Grid: Kanban Dispatch Board (8 cols) + Inventory (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <KanbanDispatchBoard
            prepOrders={prepOrders}
            readyOrders={readyOrders}
            onMarkReady={id => updateStatus(id, 'listo')}
            onRevertToPrep={id => updateStatus(id, 'preparacion')}
            onDeliver={id => deliverOrder(id)}
            onSimulateIncoming={simulateIncoming}
          />
        </div>

        <div className="lg:col-span-4">
          <InventoryLivePanel
            products={products}
            onAdjustStock={(id, delta) => adjustStock(id, delta)}
            onReplenishStock={() => replenishStock(10)}
          />
        </div>
      </div>
    </div>
  );
};
