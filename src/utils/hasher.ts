import bcrypt from 'bcryptjs';

export const hash = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    
    return hashed;
}

export const compare = async (password: string, hashed: string) => {
    const compared = await bcrypt.compare(password, hashed);

    return compared;
}
