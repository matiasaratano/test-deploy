import Jwt from 'jsonwebtoken';

const AdminAuth = async (req, res, next) => {
  try {
    const token = req.header("Token");
    if (!token) {
      return res.status(401).send({ error: "Acceso denegado. No se encontró el token." });
    }

    const decoded = Jwt.verify(token, process.env.CLAVE_SECRETA);

    if (decoded.role.toLowerCase() === "administrador") {
      next(); 
    } else {
      return res.status(403).send({ error: "Acceso denegado. Se requiere rol de administrador." });
    }
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

export default AdminAuth;