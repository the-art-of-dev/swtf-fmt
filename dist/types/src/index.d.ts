import { SwtfTask, SwtfTaskAttribute } from 'swtf-parser';
export declare function attributeToSwtf(attribute: SwtfTaskAttribute): string;
export declare function taskToSwtf(task: SwtfTask): string;
export declare function tasksToSwtf(tasks: SwtfTask[]): string;
export declare function formatSwtf(rawSwtf: string): string;
