import React from 'react';

import { ViewElement } from '../../../context/elements';

import { Controls } from '../../Controls';

import { Title } from '../Controls/Title';
import { displayText } from '../../../displayText/en';
import { CLASS_BASE } from '../../constants';
import { DestinationPicker } from './DestinationPicker';

import { DataTableControl } from '../../../controls/DataTableControl';
import { ControlsContextProvider } from '../../../controls/context';
import { getActionViewTableData } from '../getActionViewTableData';
import { ControlsContext } from '../../../controls/types';
import { ActionStartControl } from '../../../controls/ActionStartControl';
import { DescriptionList } from '../../../components/DescriptionList';
import { StatusDisplayControl } from '../../../controls/StatusDisplayControl';
import { getDestinationListFullPrefix } from './getDestinationListFullPrefix';
import { ActionCancelControl } from '../../../controls/ActionCancelControl';
import { useCopyView } from './useCopyView';
import { CopyViewProps } from './types';

const { Exit } = Controls;
const { actionSetDestination } = displayText;

export const CopyView = ({
  onExit: onExitProps,
}: CopyViewProps): React.JSX.Element => {
  const {
    destinationList,
    isProcessing,
    isProcessingComplete,
    location,
    statusCounts,
    tasks,
    onActionCancel,
    onActionStart,
    onDestinationChange,
    onExit,
    onTaskCancel,
  } = useCopyView({ onExit: onExitProps });

  const tableData = getActionViewTableData({
    tasks,
    locationKey: location.key,
    isProcessing,
    shouldDisplayProgress: false,
    onTaskCancel,
  });

  const isActionStartDisabled =
    isProcessing || isProcessingComplete || destinationList.length === 0;

  const isActionCancelDisabled = !isProcessing || isProcessingComplete;

  const contextValue: ControlsContext = {
    data: {
      statusCounts,
      tableData,
      actionStartLabel: 'Copy',
      isActionStartDisabled,
      isActionCancelDisabled,
      actionCancelLabel: 'Cancel',
    },
    onActionStart,
    onActionCancel,
  };

  return (
    <ControlsContextProvider {...contextValue}>
      <Exit onClick={onExit} disabled={isProcessing} />
      <Title />
      <ViewElement className={`${CLASS_BASE}__table-wrapper`}>
        <DataTableControl className={`${CLASS_BASE}__copy-view-data-table`} />
      </ViewElement>
      {isProcessing || isProcessingComplete ? (
        <ViewElement className={`${CLASS_BASE}__action-destination`}>
          <DescriptionList
            descriptions={[
              {
                term: `${actionSetDestination}:`,
                details: getDestinationListFullPrefix(destinationList),
              },
            ]}
          />
        </ViewElement>
      ) : (
        <DestinationPicker
          destinationList={destinationList}
          onDestinationChange={onDestinationChange}
        />
      )}

      <ViewElement className={`${CLASS_BASE}__action-footer`}>
        {isProcessing || isProcessingComplete ? (
          <StatusDisplayControl
            className={`${CLASS_BASE}__action-status-display`}
          />
        ) : (
          <ViewElement className={`${CLASS_BASE}__action-status-display`}>
            Copy action may overwrite existing files at selected destination.
          </ViewElement>
        )}
        <ActionCancelControl className={`${CLASS_BASE}__cancel`} />
        <ActionStartControl className={`${CLASS_BASE}__upload-action-start`} />
      </ViewElement>
    </ControlsContextProvider>
  );
};
