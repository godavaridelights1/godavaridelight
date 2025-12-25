#!/usr/bin/env node

/**
 * Script to test Razorpay connection
 * Run: node scripts/test-razorpay.js
 */

const { PrismaClient } = require('@prisma/client')
const Razorpay = require('razorpay')
const prisma = new PrismaClient()

async function testRazorpay() {
  try {
    console.log('\n🔍 Testing Razorpay Connection...\n')

    const config = await prisma.paymentConfig.findFirst()

    if (!config || !config.razorpayKeyId || !config.razorpayKeySecret) {
      console.log('❌ Razorpay keys not configured')
      console.log('\n📋 Steps to configure:')
      console.log('  1. Sign up at https://razorpay.com')
      console.log('  2. Get test keys from: https://dashboard.razorpay.com/app/website-app-settings/api-keys')
      console.log('  3. Go to http://localhost:3000/admin/settings')
      console.log('  4. Enter your keys and save')
      process.exit(1)
    }

    console.log(`Testing with Key ID: ${config.razorpayKeyId.substring(0, 15)}...`)
    console.log(`Mode: ${config.isTestMode ? 'Test' : 'Live'}`)
    console.log('')

    const razorpay = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret
    })

    // Try to create a test order
    console.log('Creating test order...')
    const order = await razorpay.orders.create({
      amount: 100, // ₹1 in paise
      currency: 'INR',
      receipt: 'test_receipt_' + Date.now(),
      notes: {
        test: 'true'
      }
    })

    console.log('✅ Success! Razorpay connection is working')
    console.log('\nTest Order Created:')
    console.log(`  - Order ID: ${order.id}`)
    console.log(`  - Amount: ₹${order.amount / 100}`)
    console.log(`  - Currency: ${order.currency}`)
    console.log(`  - Status: ${order.status}`)
    console.log('\n✅ Your Razorpay configuration is correct!')

  } catch (error) {
    console.error('❌ Razorpay Connection Failed\n')
    
    if (error.statusCode === 401) {
      console.log('Authentication Error (401)')
      console.log('This means your Razorpay keys are incorrect or invalid.\n')
      console.log('Possible reasons:')
      console.log('  1. Keys are sample/dummy values (rzp_test_sample...)')
      console.log('  2. Keys were regenerated in Razorpay dashboard')
      console.log('  3. Keys are copied incorrectly (extra spaces, missing characters)')
      console.log('  4. You\'re using test keys in live mode or vice versa')
      console.log('\n📋 How to fix:')
      console.log('  1. Go to https://dashboard.razorpay.com/app/website-app-settings/api-keys')
      console.log('  2. Use EXISTING keys or generate NEW test keys')
      console.log('  3. Copy the Key Id (starts with rzp_test_)')
      console.log('  4. Copy the Key Secret')
      console.log('  5. Go to http://localhost:3000/admin/settings')
      console.log('  6. Paste both keys and save')
    } else {
      console.log('Error:', error.error?.description || error.message)
      console.log('\nFull error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testRazorpay()
