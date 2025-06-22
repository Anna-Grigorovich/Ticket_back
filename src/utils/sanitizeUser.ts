export function sanitizeUser(user: any): Record<string, any> {
    if (!user || typeof user !== 'object') return {};

    const { password, __v, ...rest } = user;
    return rest;
}

