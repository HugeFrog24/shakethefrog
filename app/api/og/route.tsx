import { ImageResponse } from 'next/og'
import { appConfig } from '../../config/app'

export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.assets.ogImage.bgColor,
          fontSize: 60,
          fontWeight: 600,
        }}
      >
        <img
          src={`${baseUrl}${appConfig.assets.favicon}`}
          alt={appConfig.name}
          width={200}
          height={200}
          style={{ margin: '0 0 40px' }}
        />
        <div style={{ marginBottom: 20 }}>{appConfig.name}</div>
        <div 
          style={{ 
            fontSize: 30, 
            fontWeight: 400,
            color: appConfig.assets.ogImage.textColor
          }}
        >
          {appConfig.description}
        </div>
      </div>
    ),
    {
      width: appConfig.assets.ogImage.width,
      height: appConfig.assets.ogImage.height,
    },
  )
} 