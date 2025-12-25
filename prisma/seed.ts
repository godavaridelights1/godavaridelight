import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.productReview.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.address.deleteMany()
  await prisma.message.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.product.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.paymentConfig.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User
  console.log('👤 Creating users...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@godavaridelights.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 9876543210',
      emailVerified: new Date()
    }
  })

  const customer1 = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: customerPassword,
      role: 'customer',
      phone: '+91 9876543211',
      emailVerified: new Date()
    }
  })

  const customer2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: customerPassword,
      role: 'customer',
      phone: '+91 9876543212',
      emailVerified: new Date()
    }
  })

  console.log('✅ Users created')

  // Create Products
  console.log('🍬 Creating products...')
  
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Traditional Putharekulu',
        description: 'Authentic Atreyapuram Putharekulu made with premium rice starch, ghee, and sugar. Delicately thin and crispy layers that melt in your mouth.',
        price: 299,
        originalPrice: 349,
        category: 'Traditional Sweets',
        image: '/traditional-putharekulu-sweet.jpg',
        inStock: true,
        featured: true,
        weight: '250g',
        ingredients: ['Rice Starch', 'Sugar', 'Ghee', 'Cardamom'],
        nutritionalInfo: {
          calories: 350,
          protein: '4g',
          carbs: '68g',
          fat: '8g'
        },
        averageRating: 4.8,
        reviewCount: 45
      }
    }),
    prisma.product.create({
      data: {
        name: 'Dry Fruits Putharekulu',
        description: 'Premium Putharekulu enriched with cashews, almonds, and pistachios. Perfect for gifting and celebrations.',
        price: 499,
        originalPrice: 599,
        category: 'Premium Sweets',
        image: '/dry-fruits-putharekulu-almonds-cashews.jpg',
        inStock: true,
        featured: true,
        weight: '500g',
        ingredients: ['Rice Starch', 'Sugar', 'Ghee', 'Cashews', 'Almonds', 'Pistachios'],
        nutritionalInfo: {
          calories: 420,
          protein: '8g',
          carbs: '62g',
          fat: '15g'
        },
        averageRating: 4.9,
        reviewCount: 38
      }
    }),
    prisma.product.create({
      data: {
        name: 'Saffron Putharekulu',
        description: 'Royal saffron-infused Putharekulu with a golden hue. A luxurious treat for special occasions.',
        price: 699,
        originalPrice: 799,
        category: 'Premium Sweets',
        image: '/saffron-putharekulu-premium-golden-sweet.jpg',
        inStock: true,
        featured: true,
        weight: '500g',
        ingredients: ['Rice Starch', 'Sugar', 'Ghee', 'Saffron', 'Cardamom'],
        nutritionalInfo: {
          calories: 380,
          protein: '5g',
          carbs: '70g',
          fat: '10g'
        },
        averageRating: 5.0,
        reviewCount: 28
      }
    }),
    prisma.product.create({
      data: {
        name: 'Coconut Putharekulu',
        description: 'Traditional Putharekulu with fresh coconut filling. A delightful fusion of flavors.',
        price: 349,
        originalPrice: 399,
        category: 'Traditional Sweets',
        image: '/coconut-putharekulu-traditional-sweet.jpg',
        inStock: true,
        featured: false,
        weight: '250g',
        ingredients: ['Rice Starch', 'Sugar', 'Ghee', 'Fresh Coconut'],
        nutritionalInfo: {
          calories: 370,
          protein: '5g',
          carbs: '65g',
          fat: '12g'
        },
        averageRating: 4.7,
        reviewCount: 32
      }
    }),
    prisma.product.create({
      data: {
        name: 'Festival Gift Box',
        description: 'Assorted Putharekulu gift box with 4 varieties. Perfect for festivals and celebrations.',
        price: 899,
        originalPrice: 1099,
        category: 'Gift Boxes',
        image: '/festival-putharekulu-gift-box-assorted.jpg',
        inStock: true,
        featured: true,
        weight: '1kg',
        ingredients: ['Assorted Putharekulu Varieties'],
        nutritionalInfo: {
          calories: 390,
          protein: '6g',
          carbs: '68g',
          fat: '11g'
        },
        averageRating: 4.9,
        reviewCount: 52
      }
    }),
    prisma.product.create({
      data: {
        name: 'Royal Gift Hamper',
        description: 'Premium gift hamper with exclusive Putharekulu varieties and traditional sweets.',
        price: 1499,
        originalPrice: 1799,
        category: 'Gift Boxes',
        image: '/royal-gift-hamper-premium-indian-sweets.jpg',
        inStock: true,
        featured: true,
        weight: '2kg',
        ingredients: ['Premium Putharekulu Varieties', 'Traditional Sweets'],
        nutritionalInfo: {
          calories: 400,
          protein: '7g',
          carbs: '70g',
          fat: '13g'
        },
        averageRating: 5.0,
        reviewCount: 18
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sugar Free Putharekulu',
        description: 'Healthy sugar-free Putharekulu made with natural sweeteners. Perfect for health-conscious customers.',
        price: 399,
        originalPrice: 449,
        category: 'Healthy Options',
        image: '/traditional-indian-sweet-putharekulu.jpg',
        inStock: true,
        featured: false,
        weight: '250g',
        ingredients: ['Rice Starch', 'Natural Sweetener', 'Ghee'],
        nutritionalInfo: {
          calories: 280,
          protein: '4g',
          carbs: '52g',
          fat: '7g'
        },
        averageRating: 4.6,
        reviewCount: 22
      }
    }),
    prisma.product.create({
      data: {
        name: 'Mini Putharekulu Pack',
        description: 'Convenient mini pack of traditional Putharekulu. Perfect for trying or gifting.',
        price: 149,
        originalPrice: 199,
        category: 'Traditional Sweets',
        image: '/traditional-putharekulu-sweet.jpg',
        inStock: true,
        featured: false,
        weight: '100g',
        ingredients: ['Rice Starch', 'Sugar', 'Ghee'],
        nutritionalInfo: {
          calories: 340,
          protein: '4g',
          carbs: '66g',
          fat: '8g'
        },
        averageRating: 4.7,
        reviewCount: 65
      }
    })
  ])

  console.log('✅ Products created')

  // Create Addresses
  console.log('📍 Creating addresses...')
  
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      name: 'Rajesh Kumar',
      phone: '+91 9876543211',
      street: '123, MG Road, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      isDefault: true
    }
  })

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      name: 'Priya Sharma',
      phone: '+91 9876543212',
      street: '456, Banjara Hills Road No 12',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      isDefault: true
    }
  })

  console.log('✅ Addresses created')

  // Create Coupons
  console.log('🎫 Creating coupons...')
  
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 299,
        maxDiscount: 100,
        usageLimit: 100,
        usedCount: 15,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        isActive: true,
        description: 'Welcome offer: Get 10% off on your first order'
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'FESTIVAL50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 500,
        usageLimit: 50,
        usedCount: 8,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        isActive: true,
        description: 'Festival special: Flat ₹50 off on orders above ₹500'
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'PREMIUM20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 1000,
        maxDiscount: 300,
        usageLimit: 30,
        usedCount: 5,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        isActive: true,
        description: 'Premium offer: Get 20% off on orders above ₹1000'
      }
    })
  ])

  console.log('✅ Coupons created')

  // Create Banners
  console.log('🎨 Creating banners...')
  
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Authentic Atreyapuram Putharekulu',
        description: 'Experience the traditional taste of Godavari region',
        image: '/traditional-indian-sweet-putharekulu.jpg',
        link: '/products',
        buttonText: 'Shop Now',
        isActive: true,
        displayOrder: 1
      }
    }),
    prisma.banner.create({
      data: {
        title: 'Festival Special Offers',
        description: 'Get up to 20% off on premium gift boxes',
        image: '/festival-indian-sweets-diwali.jpg',
        link: '/products?category=Gift+Boxes',
        buttonText: 'Browse Collection',
        isActive: true,
        displayOrder: 2
      }
    }),
    prisma.banner.create({
      data: {
        title: 'Premium Gift Hampers',
        description: 'Perfect for celebrations and gifting',
        image: '/royal-gift-hamper-premium-indian-sweets.jpg',
        link: '/products?category=Gift+Boxes',
        buttonText: 'Explore Gifts',
        isActive: true,
        displayOrder: 3
      }
    })
  ])

  console.log('✅ Banners created')

  // Create Newsletter Subscriptions
  console.log('📧 Creating newsletter subscriptions...')
  
  await Promise.all([
    prisma.newsletter.create({
      data: {
        email: 'subscriber1@example.com',
        isActive: true
      }
    }),
    prisma.newsletter.create({
      data: {
        email: 'subscriber2@example.com',
        isActive: true
      }
    }),
    prisma.newsletter.create({
      data: {
        email: 'subscriber3@example.com',
        isActive: true
      }
    })
  ])

  console.log('✅ Newsletter subscriptions created')

  // Create Orders
  console.log('📦 Creating orders...')
  
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      subtotal: 798,
      discount: 80,
      deliveryCharge: 0,
      total: 718,
      couponCode: 'WELCOME10',
      addressId: address1.id,
      notes: 'Please deliver in the evening',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            price: 299
          },
          {
            productId: products[3].id,
            quantity: 1,
            price: 349
          }
        ]
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      orderNumber: `ORD-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      subtotal: 1198,
      discount: 50,
      deliveryCharge: 0,
      total: 1148,
      couponCode: 'FESTIVAL50',
      addressId: address2.id,
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            price: 499
          },
          {
            productId: products[2].id,
            quantity: 1,
            price: 699
          }
        ]
      }
    }
  })

  const order3 = await prisma.order.create({
    data: {
      userId: customer1.id,
      orderNumber: `ORD-${Date.now() + 2}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      subtotal: 899,
      discount: 0,
      deliveryCharge: 50,
      total: 949,
      addressId: address1.id,
      notes: 'COD order',
      items: {
        create: [
          {
            productId: products[4].id,
            quantity: 1,
            price: 899
          }
        ]
      }
    }
  })

  console.log('✅ Orders created')

  // Create Product Reviews
  console.log('⭐ Creating product reviews...')
  
  await Promise.all([
    prisma.productReview.create({
      data: {
        productId: products[0].id,
        userId: customer1.id,
        rating: 5,
        comment: 'Absolutely delicious! The authentic taste reminds me of home.'
      }
    }),
    prisma.productReview.create({
      data: {
        productId: products[0].id,
        userId: customer2.id,
        rating: 4,
        comment: 'Very good quality, but wish the packaging was better.'
      }
    }),
    prisma.productReview.create({
      data: {
        productId: products[1].id,
        userId: customer2.id,
        rating: 5,
        comment: 'The dry fruits combination is perfect! Highly recommended.'
      }
    }),
    prisma.productReview.create({
      data: {
        productId: products[2].id,
        userId: customer1.id,
        rating: 5,
        comment: 'Premium quality saffron putharekulu. Worth every rupee!'
      }
    })
  ])

  console.log('✅ Product reviews created')

  // Create Cart for customer1
  console.log('🛒 Creating carts...')
  
  const cart = await prisma.cart.create({
    data: {
      userId: customer1.id,
      items: {
        create: [
          {
            productId: products[5].id,
            quantity: 1
          }
        ]
      }
    }
  })

  console.log('✅ Carts created')

  // Create Payment Config
  console.log('💳 Creating payment config...')
  
  await prisma.paymentConfig.create({
    data: {
      razorpayKeyId: 'rzp_test_sample_key_id',
      razorpayKeySecret: 'sample_secret_for_testing',
      isTestMode: true
    }
  })

  console.log('✅ Payment config created')

  console.log('\n✨ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log('   👤 Users: 3 (1 admin, 2 customers)')
  console.log('   🍬 Products: 8')
  console.log('   📍 Addresses: 2')
  console.log('   🎫 Coupons: 3')
  console.log('   🎨 Banners: 3')
  console.log('   📧 Newsletter: 3 subscribers')
  console.log('   📦 Orders: 3')
  console.log('   ⭐ Reviews: 4')
  console.log('   🛒 Carts: 1')
  console.log('   💳 Payment Config: 1')
  console.log('\n🔐 Login Credentials:')
  console.log('   Admin: admin@godavaridelights.com / admin123')
  console.log('   Customer 1: rajesh@example.com / customer123')
  console.log('   Customer 2: priya@example.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
