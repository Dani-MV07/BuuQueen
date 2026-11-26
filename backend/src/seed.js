import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import { AccommodationModel } from './models/accommodation.model.js';
import { CategoryModel } from './models/category.model.js';
import { HostModel } from './models/host.model.js';
import { ImageModel } from './models/image.model.js';
import { LocationModel } from './models/location.model.js';
import { ProfileModel } from './models/profile.model.js';
import { RevokeTokenModel } from './models/revoke_token.model.js';
import { RoleModel } from './models/role.model.js';
import { UserModel } from './models/user.model.js';
import { VariantModel } from './models/variant.model.js';
import { hashPassword } from './utils/password.util.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Promise.all([
      ImageModel.deleteMany({}),
      VariantModel.deleteMany({}),
      AccommodationModel.deleteMany({}),
      HostModel.deleteMany({}),
      ProfileModel.deleteMany({}),
      RevokeTokenModel.deleteMany({}),
      UserModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      LocationModel.deleteMany({}),
      RoleModel.deleteMany({})
    ]);

    const roleNames = [
      'Admin', 'Host', 'Guest', 'Supervisor', 'Editor', 'Moderador', 'Soporte',
      'Marketing', 'Recepcionista', 'Contable', 'Auditor', 'Colaborador',
      'Gestor', 'Analista', 'Comercial', 'Diseñador', 'Desarrollador',
      'Partner', 'Consultor', 'Observador'
    ];
    const roles = await RoleModel.insertMany(roleNames.map((name, index) => ({
      name,
      description: `Rol de ejemplo ${index + 1}: ${name}`,
      slug: index === 0 ? 'admin'
        : index === 1 ? 'host'
          : index === 2 ? 'guest'
            : `role-${index + 1}-${name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`
    })));
    const roleByName = Object.fromEntries(roles.map(role => [role.slug, role]));
    const seedAdminPasswordHash = await hashPassword('1234');
    const seedPasswordHash = await hashPassword('BuuQueen123!');

    const users = await UserModel.insertMany([
      {
        name: 'Admin BuuQueen',
        email: 'admin@buuqueen.local',
        passwordHash: seedAdminPasswordHash,
        role_id: roleByName.admin._id,
        description: 'Cuenta administradora principal.',
        slug: 'admin-buuqueen'
      },
      ...Array.from({ length: 17 }, (_, index) => ({
        name: `Anfitrión Ejemplo ${index + 1}`,
        email: `anfitrion${index + 1}@buuqueen.local`,
        passwordHash: seedPasswordHash,
        role_id: roleByName.host._id,
        description: `Perfil anfitrión de ejemplo número ${index + 1}.`,
        slug: `anfitrion-ejemplo-${index + 1}`
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        name: `Huésped Ejemplo ${index + 1}`,
        email: `huesped${index + 1}@buuqueen.local`,
        passwordHash: seedPasswordHash,
        role_id: roleByName.guest._id,
        description: `Perfil huésped de ejemplo número ${index + 1}.`,
        slug: `huesped-ejemplo-${index + 1}`
      }))
    ]);
    const userByEmail = Object.fromEntries(users.map(user => [user.email, user]));

    const categoryNames = [
      'Hotel', 'Apartamento', 'Casa rural', 'Hostal', 'Chalet', 'Villa',
      'Bungalow', 'Apartamento turístico', 'Casa de playa', 'Cabaña',
      'Dúplex', 'Estudio', 'Loft', 'Apartamento rural', 'Bed & Breakfast',
      'Casa en la montaña', 'Residencia', 'Piso compartido', 'Finca', 'Camping'
    ];
    const categories = await CategoryModel.insertMany(categoryNames.map((name, index) => ({
      name,
      description: `Categoría de alojamiento de ejemplo ${index + 1}: ${name}.`,
      slug: `categoria-${index + 1}-${name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]+/g, '-')}`
    })));
    const categoryBySlug = Object.fromEntries(categories.map(category => [category.slug, category]));

    const cityData = [
      ['Valencia', 'España', 'Calle Mayor', 39.4699, -0.3763],
      ['Barcelona', 'España', 'Passeig de Gràcia', 41.3874, 2.1686],
      ['Girona', 'España', 'Carrer de la Força', 41.9794, 2.8214],
      ['Madrid', 'España', 'Gran Vía', 40.4168, -3.7038],
      ['Sevilla', 'España', 'Avenida de la Constitución', 37.3891, -5.9845],
      ['Málaga', 'España', 'Calle Larios', 36.7213, -4.4214],
      ['Bilbao', 'España', 'Gran Vía de Don Diego López', 43.2630, -2.9350],
      ['Zaragoza', 'España', 'Calle Don Jaime I', 41.6488, -0.8891],
      ['Salamanca', 'España', 'Plaza Mayor', 40.9650, -5.6639],
      ['Granada', 'España', 'Recogidas', 37.1773, -3.5986],
      ['París', 'Francia', 'Rue de Rivoli', 48.8566, 2.3522],
      ['Roma', 'Italia', 'Via del Corso', 41.9028, 12.4964],
      ['Lisboa', 'Portugal', 'Rua Augusta', 38.7223, -9.1393],
      ['Bruselas', 'Bélgica', 'Rue Neuve', 50.8503, 4.3517],
      ['Ámsterdam', 'Países Bajos', 'Damrak', 52.3676, 4.9041],
      ['Berna', 'Suiza', 'Marktgasse', 46.9480, 7.4474],
      ['Viena', 'Austria', 'Kärntner Straße', 48.2082, 16.3738],
      ['Praga', 'República Checa', 'Na Příkopě', 50.0755, 14.4378],
      ['Budapest', 'Hungría', 'Váci utca', 47.4979, 19.0402],
      ['Copenhague', 'Dinamarca', 'Strøget', 55.6761, 12.5683]
    ];
    const locations = await LocationModel.insertMany(cityData.map(([city, country, address, latitude, longitude], index) => ({
      country,
      city,
      address: `${address} ${index + 1}`,
      coordinates: [latitude, longitude],
      description: `Ubicación de ejemplo en ${city}, ${country}.`,
      slug: `ubicacion-${index + 1}-${city.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`
    })));
    const locationBySlug = Object.fromEntries(locations.map(location => [location.slug, location]));

    const hosts = await HostModel.insertMany(users.map((user, index) => ({
      user_id: user._id,
      bio: `Anfitrión local especializado en experiencias de viaje número ${index + 1}.`,
      description: `Perfil de anfitrión de ejemplo ${index + 1}.`,
      slug: `host-ejemplo-${index + 1}`
    })));
    const hostBySlug = Object.fromEntries(hosts.map(host => [host.slug, host]));

    const accommodationNames = [
      'Hotel Vista al Mar', 'Apartamento en el corazón de Barcelona', 'Casa rural de Girona',
      'Chalet tranquilo en Madrid', 'Hostal Plaza Sevilla', 'Villa Málaga Sol',
      'Bungalow Bilbao Verde', 'Estudio Zaragoza Centro', 'Piso romántico Salamanca',
      'Casa colonial Granada', 'Apartamento París Clásico', 'Loft Roma Moderna',
      'Villa Lisboa Atlántico', 'Residencia Bruselas Norte', 'Dúplex Ámsterdam Central',
      'Chalet Suizo Berna', 'Hostal Viena Imperial', 'Apartamento Praga Vieja',
      'Casa Budapest Danubio', 'Estudio Copenhague Escandinavo'
    ];
    const accommodations = await AccommodationModel.insertMany(accommodationNames.map((title, index) => ({
      title,
      description: `Alojamiento de ejemplo ${index + 1} con todas las comodidades necesarias para una estancia agradable.`,
      slug: `alojamiento-ejemplo-${index + 1}`,
      category_id: categories[index]._id,
      location_id: locations[index]._id,
      host_id: hosts[index % hosts.length]._id,
      status: 'published',
      isActive: true
    })));
    const accommodationBySlug = Object.fromEntries(
      accommodations.map(accommodation => [accommodation.slug, accommodation])
    );

    const variantTypes = [
      { label: 'Estándar', priceFactor: 1, capacityOffset: 0, stockOffset: 1 },
      { label: 'Premium', priceFactor: 1.35, capacityOffset: 2, stockOffset: 3 },
      { label: 'Familiar', priceFactor: 1.65, capacityOffset: 4, stockOffset: 5 }
    ];
    const variants = await VariantModel.insertMany(accommodations.flatMap((accommodation, index) =>
      variantTypes.map((type, typeIndex) => ({
        accommodation_id: accommodation._id,
        sku: `BQ-${String(index + 1).padStart(3, '0')}-${type.label.slice(0, 3).toUpperCase()}`,
        price: Math.round((75 + (index * 17.5)) * type.priceFactor),
        stock: ((index + typeIndex) % 8) + type.stockOffset,
        capacity: ((index % 3) + type.capacityOffset + 1),
        description: `Opción ${type.label.toLocaleLowerCase('es')} para ${accommodation.title}.`,
        slug: `opcion-${type.label.toLocaleLowerCase('es')}-${index + 1}`,
        status: 'available',
        isActive: true
      }))
    ));

    const profiles = await ProfileModel.insertMany(users.map((user, index) => ({
      user_id: user._id,
      avatar: '',
      phone: `+34 600 000 ${String(index + 1).padStart(3, '0')}`,
      bio: `Perfil de ejemplo ${index + 1} de BuuQueen.`,
      deletedAt: null
    })));

    const revokeTokens = await RevokeTokenModel.insertMany(users.map((user, index) => ({
      tokenHash: crypto.createHash('sha256').update(`buuqueen-seed-token-${index + 1}-${Date.now()}`).digest('hex'),
      user_id: user._id,
      expiresAt: new Date(Date.now() + ((index + 1) * 24 * 60 * 60 * 1000))
    })));

    const photoIds = [
      'photo-1566073771259-6a8506099945', 'photo-1522708323590-d24dbb6b0267',
      'photo-1449158743715-0a90ebb6d2d8', 'photo-1582719478250-c89cae4dc85b',
      'photo-1564501049412-61c2a3083791', 'photo-1540541338287-41700207dee6',
      'photo-1571896349842-33c89424de2d', 'photo-1551884831-bbf3cdc6469e',
      'photo-1520250497591-112f2f40a3f4', 'photo-1499793983690-e29da59ef1c2',
      'photo-1505693416388-ac5ce068fe85', 'photo-1560448204-e02f11c3d0e2',
      'photo-1566665797739-1674de7a421a', 'photo-1584132967334-10e028bd69f7',
      'photo-1542314831-068cd1dbfeeb', 'photo-1578683010236-d716f9a3f461',
      'photo-1590490360182-c33d57733427', 'photo-1568495248636-6432b97bd949',
      'photo-1556020685-ae41abfc9365', 'photo-1587985064135-0366536eab42'
    ];
    const images = await ImageModel.insertMany(accommodations.map((accommodation, index) => ({
      entity_type: 'Accommodation',
      entity_id: accommodation._id,
      url_image: `https://images.unsplash.com/${photoIds[index]}?auto=format&fit=crop&w=1200&q=80`,
      slug: `imagen-alojamiento-ejemplo-${index + 1}`
    })));

    console.log('Seed completado correctamente.');
    console.log(JSON.stringify({
      roles: roles.length,
      users: users.length,
      categories: categories.length,
      locations: locations.length,
      hosts: hosts.length,
      accommodations: accommodations.length,
      variants: variants.length,
      images: images.length,
      profiles: profiles.length,
      revokeTokens: revokeTokens.length
    }, null, 2));
  } catch (error) {
    console.error('Error en el seed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

seed();
