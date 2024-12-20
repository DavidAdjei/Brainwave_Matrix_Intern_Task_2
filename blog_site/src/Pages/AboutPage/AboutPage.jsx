import React from 'react'
import './AboutPage.css'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const AboutPage = () => {
  const { isAuth } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const onButtonClick = page => {
    navigate(`/${page}`)
  }

  return (
    <div className='about-page'>
      <section className='hero-container'>
        <div className='hero-content'>
          <h1>A modern publishing platform</h1>
          <p>Grow your audience and build your online brand</p>
          {!isAuth && (
            <div className='hero-buttons'>
              <button
                className='start-free'
                onClick={() => onButtonClick('signup')}
              >
                Start for Free
              </button>
            </div>
          )}
        </div>
      </section>

      <h1 className='future-heading'>Designs for the future</h1>
      <section className='features future'>
        <h1>Designs for the future</h1>
        <div className='left'>
          <div className='feature'>
            <h2>Introducing an extensible editor</h2>
            <p>
              Our platform features an intuitive editor that lets you focus on
              creating content. With support for embeds like images, videos, and
              Markdown, you can extend functionality with themes and plugins.
            </p>
          </div>
          <div className='feature'>
            <h2>Robust content management</h2>
            <p>
              Manage posts effortlessly with categories, sections, and custom
              formats, giving you full control of your blog.
            </p>
          </div>
        </div>
      </section>

      <section className='infrastructure'>
        <div className='phone-section'></div>
        <div className='infrastructure-content'>
          <h2>State of the Art Infrastructure</h2>
          <p>
            With reliability and speed in mind, global data centers provide fast
            connectivity for instant site loading, keeping your site
            competitive.
          </p>
        </div>
      </section>

      <section className='simple-powerful'>
        <div className='simple'>
          <div className='simple-content'>
            <h2>Free, open, simple</h2>
            <p>
              Backed by a community of developers, our app supports syntax
              highlighting, social media integration, and works seamlessly with
              tools like Google Analytics.
            </p>
          </div>
          <div className='powerful-content'>
            <h2>Powerful tooling</h2>
            <p>
              Customization and deployment made easy with a simple yet powerful
              CLI tool for building even the most complex sites.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
