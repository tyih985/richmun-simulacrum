import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  NodeChange,
  NodeSelectionChange,
  EdgeSelectionChange,
  Node,
  Edge,
} from '@xyflow/react';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  userFactions: string[];

  setUserFactions: (factions: string[]) => void;
  syncNodes: (nodes: Node[]) => void;
  syncEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  updateSelection: (selection: { nodes: string[]; edges: string[] }) => void;

  // private
  _selectedNodesLock: string[];
  _selectedEdgesLock: string[];
}

/**
 * Helper function to filter nodes based on user factions
 */
const filterNodesByFactions = (nodes: Node[], userFactions: string[]): Node[] => {
  return nodes.filter((node) => {
    const visibilityFactions = node.data?.visibilityFactions;
    
    // If no visibilityFactions field, assume 'staff-only'
    if (!visibilityFactions || !Array.isArray(visibilityFactions)) {
      return userFactions.includes('staff-only');
    }
    
    // Check if user has any matching faction
    return visibilityFactions.some(faction => userFactions.includes(faction));
  });
};

/**
 * This store is a singleton for exclusive interaction with ReactFlow
 * It tracks node positions and edges between nodes, and should be initialized with
 * a useShallow selector.
 * - selector:  a function that extracts specific parts of the store to use that prevents unnecessary re-renders
 * - .setState: a function that updates the store, and re-renders the component that uses the store
 *
 * It does not handle adding or removing nodes or edges, nor updating their data.
 * Updating the database may be handled outside of this store through event handlers,
 * such as 'onConnectEnd' or 'onDragEnd'
 */
export const useFlowState = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  userFactions: [],
  _selectedNodesLock: [],
  _selectedEdgesLock: [],

  setUserFactions: (factions: string[]) => {
    set((state: FlowState): Pick<FlowState, 'userFactions'> => {
      return {
        userFactions: factions,
      };
    });
  },

  syncNodes: (nodes: Node[]) => {
    set((state: FlowState): Pick<FlowState, 'nodes'> => {
      // Apply the selection lock to the new nodes
      const syncedNodes = nodes.map((node) => {
        const oldNode = state.nodes.find((n) => n.id === node.id);
        return {
          ...oldNode,
          ...node,
          type: node.type === 'draft' ? 'pin' : node.type, // removing drafts
          selected: state._selectedNodesLock.includes(node.id),
        };
      });

      // Filter nodes based on current user factions
      const filteredNodes = filterNodesByFactions(syncedNodes, state.userFactions);

      return {
        nodes: filteredNodes,
      };
    });
  },

  syncEdges: (edges: Edge[]) => {
    set((state: FlowState): Pick<FlowState, 'edges'> => {
      // Apply the selection lock to the new edges
      const syncedEdges = edges.map((edge) => {
        const oldEdge = state.edges.find((e) => e.id === edge.id);
        return {
          ...oldEdge,
          ...edge,
          selected: state._selectedEdgesLock.includes(edge.id),
        };
      });

      return {
        edges: syncedEdges,
      };
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set((state: FlowState): Pick<FlowState, 'nodes' | '_selectedNodesLock'> => {
      const updatedNodes = applyNodeChanges(changes, state.nodes) as Node[];

      // respect unselect events, just don't auto-unselect behaviour on data update
      const selectChanges = changes.filter(
        (c): c is NodeChange & { id: string } => c.type === 'select' && !!c.id,
      ) as NodeSelectionChange[];
      const newSelectedIds = selectChanges
        .filter((c): c is NodeSelectionChange => c.selected === true)
        .map((c) => c.id);
      const newUnselectedIds = selectChanges
        .filter((c): c is NodeSelectionChange => c.selected === false)
        .map((c) => c.id);
      const selectionLock = [
        ...new Set([...state._selectedNodesLock, ...newSelectedIds]),
      ].filter((id) => !newUnselectedIds.includes(id));
      const selectedLockedUpdatedNodes = updatedNodes.map((node) =>
        selectionLock.includes(node.id) && !node.selected
          ? { ...node, selected: true }
          : node,
      );

      return {
        nodes: selectedLockedUpdatedNodes,
        _selectedNodesLock: selectionLock,
      };
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    console.log('onEdgesChange', { changes });
    set((state: FlowState): Pick<FlowState, 'edges' | '_selectedEdgesLock'> => {
      console.log('onEdgesChange', {
        changes,
        _selectedEdgesLock: state._selectedEdgesLock,
      });
      const updatedEdges = applyEdgeChanges(changes, state.edges) as Edge[];

      // respect unselect events, just don't auto-unselect behaviour on data update
      const selectChanges = changes.filter(
        (c): c is EdgeChange & { id: string } => c.type === 'select' && !!c.id,
      ) as EdgeSelectionChange[];
      const newSelectedIds = selectChanges
        .filter((c): c is EdgeSelectionChange => c.selected === true)
        .map((c) => c.id);
      const newUnselectedIds = selectChanges
        .filter((c): c is EdgeSelectionChange => c.selected === false)
        .map((c) => c.id);
      const selectionLock = [
        ...new Set([...state._selectedEdgesLock, ...newSelectedIds]),
      ].filter((id) => !newUnselectedIds.includes(id));
      const selectedLockedUpdatedEdges = updatedEdges.map((edge) =>
        selectionLock.includes(edge.id) && !edge.selected
          ? { ...edge, selected: true }
          : edge,
      );

      return {
        edges: selectedLockedUpdatedEdges,
        _selectedEdgesLock: selectionLock,
      };
    });
  },

  updateSelection: ({
    nodes: selectedNodeIds,
    edges: selectedEdgeIds,
  }: {
    nodes: string[];
    edges: string[];
  }) => {
    set(
      (
        state: FlowState,
      ): Pick<
        FlowState,
        'nodes' | 'edges' | '_selectedNodesLock' | '_selectedEdgesLock'
      > => {
        const updatedNodes = state.nodes.map((node) => ({
          ...node,
          selected: selectedNodeIds.includes(node.id),
        }));

        const updatedEdges = state.edges.map((edge) => ({
          ...edge,
          selected: selectedEdgeIds.includes(edge.id),
        }));

        return {
          nodes: updatedNodes,
          edges: updatedEdges,
          _selectedNodesLock: [...selectedNodeIds],
          _selectedEdgesLock: [...selectedEdgeIds],
        };
      },
    );
  },
}));
