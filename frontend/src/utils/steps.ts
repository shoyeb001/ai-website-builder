export interface Step {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export function parseToSteps(xmlString: string): Step[] {
    const steps: Step[] = [];

    // Extract file paths
    const fileRegex = /"filePath":\s*"([^"]+)"/g;
    const files = [...xmlString.matchAll(fileRegex)].map(match => match[1]);

    // Extract shell commands
    const commandRegex = /"command":\s*"([^"]+)"/g;
    const commands = [...xmlString.matchAll(commandRegex)].map(match => match[1]);

    // Process file steps
    files.forEach((filePath, index) => {
        const fileName = filePath.split('/').pop() || '';
        steps.push({
            id: index + 1,
            title: `Generate ${fileName}`,
            description: `Creating ${filePath}`,
            status: index === 0 ? 'completed' :
                index === 1 ? 'in-progress' : 'pending'
        });
    });

    // Process command steps
    commands.forEach((command, index) => {
        steps.push({
            id: files.length + index + 1,
            title: command.includes('install') ? 'Install Dependencies' : 'Start Development Server',
            description: command,
            status: 'pending'
        });
    });

    return steps;
}
