declare namespace Cron {
  export type FindResponse = {
    items: Item[];
  };

  export type Item = {
    count: number;
    cron: string;
    description: string;
    id: number; // >0 即启用状态
    key: string;
    last_time_at: string;
    next_time_at: string;
    result: string;
    title: string;
  };
}
