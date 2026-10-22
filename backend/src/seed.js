import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AccommodationModel } from './models/accommodation.model.js';
import { CategoryModel } from './models/category.model.js';
import { HostModel } from './models/host.model.js';
import { ImageModel } from './models/image.model.js';
import { LocationModel } from './models/location.model.js';
import { RoleModel } from './models/role.model.js';
import { UserModel } from './models/user.model.js';
import { VariantModel } from './models/variant.model.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Promise.all([
      ImageModel.deleteMany({}),
      VariantModel.deleteMany({}),
      AccommodationModel.deleteMany({}),
      HostModel.deleteMany({}),
      UserModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      LocationModel.deleteMany({}),
      RoleModel.deleteMany({})
    ]);

    const roles = await RoleModel.insertMany([
      { name: 'Admin', description: 'Administración de la plataforma', slug: 'admin' },
      { name: 'Host', description: 'Usuario anfitrión que puede publicar alojamientos', slug: 'host' },
      { name: 'Guest', description: 'Usuario que puede reservar alojamientos', slug: 'guest' }
    ]);
    const roleByName = Object.fromEntries(roles.map(role => [role.slug, role]));

    const users = await UserModel.insertMany([
      {
        name: 'Admin BuuQueen',
        email: 'admin@buuqueen.local',
        role_id: roleByName.admin._id,
        slug: 'admin-buuqueen'
      },
      {
        name: 'María Pérez',
        email: 'maria.perez@buuqueen.local',
        role_id: roleByName.host._id,
        slug: 'maria-perez'
      },
      {
        name: 'Jordi Soler',
        email: 'jordi.soler@buuqueen.local',
        role_id: roleByName.host._id,
        slug: 'jordi-soler'
      },
      {
        name: 'Clara Martín',
        email: 'clara.martin@buuqueen.local',
        role_id: roleByName.guest._id,
        slug: 'clara-martin'
      }
    ]);
    const userByEmail = Object.fromEntries(users.map(user => [user.email, user]));

    const categories = await CategoryModel.insertMany([
      { name: 'Hotel', slug: 'hotel' },
      { name: 'Apartamento', slug: 'apartamento' },
      { name: 'Casa rural', slug: 'casa-rural' }
    ]);
    const categoryBySlug = Object.fromEntries(categories.map(category => [category.slug, category]));

    const locations = await LocationModel.insertMany([
      {
        country: 'España',
        city: 'Valencia',
        address: 'Calle Mayor 12',
        coordinates: [39.4699, -0.3763],
        slug: 'valencia-espana'
      },
      {
        country: 'España',
        city: 'Barcelona',
        address: 'Passeig de Gràcia 24',
        coordinates: [41.3874, 2.1686],
        slug: 'barcelona-espana'
      },
      {
        country: 'España',
        city: 'Girona',
        address: 'Carrer de la Força 8',
        coordinates: [41.9794, 2.8214],
        slug: 'girona-espana'
      }
    ]);
    const locationBySlug = Object.fromEntries(locations.map(location => [location.slug, location]));

    const hosts = await HostModel.insertMany([
      {
        user_id: userByEmail['maria.perez@buuqueen.local']._id,
        bio: 'Apasionada de la hospitalidad y de recibir viajeros.',
        slug: 'host-maria-perez'
      },
      {
        user_id: userByEmail['jordi.soler@buuqueen.local']._id,
        bio: 'Anfitrión local especializado en escapadas urbanas y rurales.',
        slug: 'host-jordi-soler'
      }
    ]);
    const hostBySlug = Object.fromEntries(hosts.map(host => [host.slug, host]));

    const accommodations = await AccommodationModel.insertMany([
      {
        title: 'Hotel Vista al Mar',
        slug: 'hotel-vista-al-mar',
        category_id: categoryBySlug.hotel._id,
        location_id: locationBySlug['valencia-espana']._id,
        host_id: hostBySlug['host-maria-perez']._id
      },
      {
        title: 'Apartamento en el corazón de Barcelona',
        slug: 'apartamento-en-el-corazon-de-barcelona',
        category_id: categoryBySlug.apartamento._id,
        location_id: locationBySlug['barcelona-espana']._id,
        host_id: hostBySlug['host-maria-perez']._id
      },
      {
        title: 'Casa rural de Girona',
        slug: 'casa-rural-de-girona',
        category_id: categoryBySlug['casa-rural']._id,
        location_id: locationBySlug['girona-espana']._id,
        host_id: hostBySlug['host-jordi-soler']._id
      }
    ]);
    const accommodationBySlug = Object.fromEntries(
      accommodations.map(accommodation => [accommodation.slug, accommodation])
    );

    const variants = await VariantModel.insertMany([
      {
        accommodation_id: accommodationBySlug['hotel-vista-al-mar']._id,
        sku: 'HVM-DBL-STD',
        price: 120.5,
        stock: 5,
        capacity: 2,
        slug: 'habitacion-doble-standard'
      },
      {
        accommodation_id: accommodationBySlug['apartamento-en-el-corazon-de-barcelona']._id,
        sku: 'BCN-APT-4P',
        price: 185,
        stock: 1,
        capacity: 4,
        slug: 'apartamento-barcelona-cuatro-personas'
      },
      {
        accommodation_id: accommodationBySlug['casa-rural-de-girona']._id,
        sku: 'GIR-RUR-6P',
        price: 210,
        stock: 2,
        capacity: 6,
        slug: 'casa-rural-girona-seis-personas'
      }
    ]);

    const images = await ImageModel.insertMany([
      {
        entity_type: 'Accommodation',
        entity_id: accommodationBySlug['hotel-vista-al-mar']._id,
        url_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        slug: 'imagen-hotel-vista-al-mar'
      },
      {
        entity_type: 'Accommodation',
        entity_id: accommodationBySlug['apartamento-en-el-corazon-de-barcelona']._id,
        url_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        slug: 'imagen-apartamento-barcelona'
      },
      {
        entity_type: 'Accommodation',
        entity_id: accommodationBySlug['casa-rural-de-girona']._id,
        url_image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8',
        slug: 'imagen-casa-rural-girona'
      },
      {
        entity_type: 'Host',
        entity_id: hostBySlug['host-maria-perez']._id,
        url_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        slug: 'imagen-host-maria-perez'
      },
      {
        entity_type: 'Variant',
        entity_id: variants[0]._id,
        url_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
        slug: 'imagen-habitacion-doble-standard'
      }
    ]);

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
      sampleHostUserRef: userByEmail['maria.perez@buuqueen.local']._id
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
