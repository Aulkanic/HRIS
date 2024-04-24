/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd';
import { type ColumnType, type ColumnGroupType } from 'antd/es/table';
import clsx from 'clsx';

interface ITableProps {
  loading?: boolean;
  classes?: any;
  datasource?: any[];
  name?: any;
  rowSelection?: any;
  pageSize?:number;
  columns: Array<ColumnType<any>> | Array<ColumnGroupType<any>>;
}

export const CustomTable = (props: ITableProps) => {
    return (
        <Table
          columns={props.columns}
          className={clsx(props.classes)}
          loading={props.loading}
          dataSource={props.datasource}
          bordered
          rowSelection={props.rowSelection}
          scroll={{
            x: '00vw',
          }}
          pagination={{
            defaultPageSize: props.pageSize ?? 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '20', '30'],
          }}
        />
      );
}
