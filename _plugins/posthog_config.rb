# frozen_string_literal: true

require 'dotenv/load'

Jekyll::Hooks.register :site, :after_init do |site|
  project_token = ENV['POSTHOG_PROJECT_TOKEN']
  host = ENV['POSTHOG_HOST']

  missing_key = if project_token.nil? || project_token.empty?
                  'POSTHOG_PROJECT_TOKEN'
                elsif host.nil? || host.empty?
                  'POSTHOG_HOST'
                end

  if missing_key
    unless Jekyll.env == 'production'
      Jekyll.logger.warn(
        'PostHog:',
        "#{missing_key} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_key} is configured"
      )
    end
    next
  end

  site.config['posthog'] = {
    'project_token' => project_token,
    'host' => host
  }
end
