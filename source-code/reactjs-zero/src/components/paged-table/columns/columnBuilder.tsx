import {ColumnType} from 'antd/es/table/interface';
import {
    BaseColumnConfig,
    BooleanColumnOptions,
    DateColumnOptions,
    EnhancedColumnConfig,
    ImageColumnOptions,
    NumberColumnOptions,
    TextColumnOptions
} from './types';
import {TextRender} from './renders/textRender';
import {NumberRender} from './renders/numberRender';
import {DateRender} from './renders/dateRender';
import {BooleanRender} from './renders/booleanRender';
import {ImageRender} from './renders/imageRender';

export class ColumnBuilder<T = any> {
    private columns: ColumnType<T>[] = [];

    // Add number column with copyable support
    addNumber(config: EnhancedColumnConfig<T> & NumberColumnOptions): this {
        const fullConfig = {...config, type: 'number' as const};

        this.columns.push({
            ...this.createBaseColumn(config),
            align: config.align || 'right',
            render: config.render || ((value: any, record: T, index: number) =>
                    NumberRender.render(value, record, fullConfig)
            )
        });
        return this;
    }

    // Add date column with copyable support
    addDate(config: EnhancedColumnConfig<T> & DateColumnOptions): this {
        const fullConfig = {...config, type: 'date' as const};

        this.columns.push({
            ...this.createBaseColumn(config),
            align: config.align || 'center',
            render: config.render || ((value: any, record: T, index: number) =>
                    DateRender.render(value, record, fullConfig)
            )
        });
        return this;
    }

    // Add text column with copyable support
    addText(config: EnhancedColumnConfig<T> & TextColumnOptions): this {
        const fullConfig = {...config, type: 'text' as const};

        this.columns.push({
            ...this.createBaseColumn(config),
            align: config.align || 'left',
            render: config.render || ((value: any, record: T, index: number) =>
                    TextRender.render(value, record, fullConfig, config.width)
            )
        });
        return this;
    }

    // Add boolean column with copyable support
    addBoolean(config: EnhancedColumnConfig<T> & BooleanColumnOptions): this {
        const fullConfig = {...config, type: 'boolean' as const};

        this.columns.push({
            ...this.createBaseColumn(config),
            align: config.align || 'center',
            render: config.render || ((value: any, record: T, index: number) =>
                    BooleanRender.render(value, record, fullConfig)
            )
        });
        return this;
    }

    // Add image column with copyable support (copy URL)
    addImage(config: EnhancedColumnConfig<T> & ImageColumnOptions): this {
        const fullConfig = {...config, type: 'image' as const};

        this.columns.push({
            ...this.createBaseColumn(config),
            align: config.align || 'center',
            render: config.render || ((value: any, record: T, index: number) =>
                    ImageRender.render(value, record, fullConfig)
            )
        });
        return this;
    }

    // Add action column
    addActions(config: {
        title?: string;
        width?: number;
        fixed?: boolean | 'left' | 'right';
        actions: Array<{
            key: string;
            label: string;
            icon?: React.ReactNode;
            onClick: (record: T) => void;
            visible?: (record: T) => boolean;
            disabled?: (record: T) => boolean;
            danger?: boolean;
        }>;
    }): this {
        this.columns.push({
            title: config.title || 'Thao tác',
            key: 'actions',
            width: config.width || 120,
            fixed: config.fixed,
            align: 'center',
            render: (_, record: T) => {
                const visibleActions = config.actions.filter(action =>
                    !action.visible || action.visible(record)
                );

                return (
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        {visibleActions.map(action => (
                            <button
                                key={action.key}
                                onClick={() => action.onClick(record)}
                                disabled={action.disabled?.(record)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: action.disabled?.(record) ? 'not-allowed' : 'pointer',
                                    color: action.danger ? '#ff4d4f' : '#1890ff',
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    fontSize: 12
                                }}
                            >
                                {action.icon} {action.label}
                            </button>
                        ))}
                    </div>
                );
            }
        });
        return this;
    }

    // Add custom column with full control
    addCustom(column: ColumnType<T>): this {
        this.columns.push(column);
        return this;
    }

    // Build columns
    build(): ColumnType<T>[] {
        return this.columns;
    }

    // Reset builder
    reset(): this {
        this.columns = [];
        return this;
    }

    // Get current columns count
    getColumnsCount(): number {
        return this.columns.length;
    }

    // Remove last column
    removeLast(): this {
        this.columns.pop();
        return this;
    }

    // Insert column at specific position
    insertAt(index: number, column: ColumnType<T>): this {
        this.columns.splice(index, 0, column);
        return this;
    }

    // Remove column by key
    removeByKey(key: string): this {
        this.columns = this.columns.filter(col => col.key !== key);
        return this;
    }

    // Update column by key
    updateByKey(key: string, updates: Partial<ColumnType<T>>): this {
        const index = this.columns.findIndex(col => col.key === key);
        if (index !== -1) {
            this.columns[index] = { ...this.columns[index], ...updates };
        }
        return this;
    }

    // Get column by key
    getByKey(key: string): ColumnType<T> | undefined {
        return this.columns.find(col => col.key === key);
    }

    // Reorder columns
    reorder(fromIndex: number, toIndex: number): this {
        const [removed] = this.columns.splice(fromIndex, 1);
        this.columns.splice(toIndex, 0, removed);
        return this;
    }

    // Clone builder
    clone(): ColumnBuilder<T> {
        const newBuilder = new ColumnBuilder<T>();
        newBuilder.columns = [...this.columns];
        return newBuilder;
    }

    /**
     * Private method to create base column configuration
     * Reduces code duplication across all add methods
     */
    private createBaseColumn(config: EnhancedColumnConfig<T>): ColumnType<T> {
        return {
            title: config.title,
            dataIndex: config.dataIndex as string,
            key: config.key || String(config.dataIndex),
            width: config.width,
            fixed: config.fixed,
            sorter: config.sortable,
            // Add other common properties here if needed
        };
    }
}