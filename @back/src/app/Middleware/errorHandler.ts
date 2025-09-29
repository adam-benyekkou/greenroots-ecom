import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: 'Something went wrong!' });
    } else {
        res.status(500).json({ message: err.message, stack: err.stack });
    }
};
