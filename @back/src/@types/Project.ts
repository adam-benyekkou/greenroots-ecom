interface Project {
    project_id?: number;
    localization_id: number;
    name: string;
    description?: string;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
}

export type { Project };

