import fetch from 'node-fetch';

async function generateImage() {
  const prompt = `
    A cozy, warm and inviting scene featuring colorful crochet yarn rolls and wooden crochet hooks arranged artistically on a soft beige linen fabric background. 
    The setting is in a well-lit, minimalist Scandinavian room with soft natural light coming through a window. 
    Yarn spools in warm colors (rose, cream, earth tones, soft yellows) are arranged with wooden needles in an artistic composition. 
    Soft shadows and depth create a professional photography aesthetic. 
    The mood is calm, creative, and welcoming - perfect for a handmade crochet business. 
    High quality, professional product photography style, warm color palette, cozy atmosphere, soft focus background with bokeh, textile textures.
  `;

  try {
    console.log('🎨 Gerando imagem do hero...');
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'sk-placeholder'}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1920x1080',
        quality: 'hd'
      })
    });

    const data = await response.json();
    
    if (data.data && data.data[0]) {
      console.log('✅ Imagem gerada!');
      console.log('URL:', data.data[0].url);
      console.log('\nAdicione esta URL ao seu app/page.tsx ou crie uma imagem local com este prompt.');
    } else {
      console.log('⚠️ DALL-E requer API key. Use Unsplash em vez disso:');
      console.log('https://unsplash.com/search/crochet-yarn');
    }
  } catch (error) {
    console.log('⚠️ API não disponível. Use alternativa Unsplash (grátis)');
  }
}

generateImage();
