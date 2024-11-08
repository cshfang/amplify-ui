import React from 'react';

import { Controls } from '../../Controls';
import { ViewElement } from '../../../context/elements';
import { DataTableControl } from '../../../controls/DataTableControl';
import { ControlsContextProvider } from '../../../controls/context';
import { CLASS_BASE } from '../../constants';
import { Title } from '../Controls/Title';
import { StatusDisplayControl } from '../../../controls/StatusDisplayControl';
import { ControlsContext } from '../../../controls/types';
import { getActionViewTableData } from '../getActionViewTableData';
import { ActionStartControl } from '../../../controls/ActionStartControl';
import { ActionCancelControl } from '../../../controls/ActionCancelControl';
import { useDeleteView } from './useDeleteView';
import { DeleteViewProps } from './types';

const { Exit } = Controls;

export const DeleteView = ({
  onExit: onExitProps,
}: DeleteViewProps): React.JSX.Element => {
  const {
    isProcessing,
    isProcessingComplete,
    location,
    statusCounts,
    tasks,
    onActionCancel,
    onActionStart,
    onExit,
    onTaskCancel,
  } = useDeleteView({ onExit: onExitProps });

  const tableData = getActionViewTableData({
    tasks,
    locationKey: location.key,
    isProcessing,
    shouldDisplayProgress: false,
    onTaskCancel,
  });

  const contextValue: ControlsContext = {
    data: {
      statusCounts,
      tableData,
      isActionStartDisabled: isProcessing || isProcessingComplete,
      actionStartLabel: 'Start',
      actionCancelLabel: 'Cancel',
      isActionCancelDisabled: !isProcessing || isProcessingComplete,
    },
    onActionStart,
    onActionCancel,
  };

  return (
    <ControlsContextProvider {...contextValue}>
      <Exit onClick={onExit} disabled={isProcessing} />
      <Title />
      <ViewElement className={`${CLASS_BASE}__table-wrapper`}>
        <DataTableControl className={`${CLASS_BASE}__delete-view-data-table`} />
      </ViewElement>
      <ViewElement className={`${CLASS_BASE}__action-footer`}>
        <StatusDisplayControl
          className={`${CLASS_BASE}__action-status-display`}
        />
        <ActionCancelControl className={`${CLASS_BASE}__cancel`} />
        <ActionStartControl />
      </ViewElement>
    </ControlsContextProvider>
  );
};
