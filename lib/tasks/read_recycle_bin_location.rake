require 'district_parser'
require 'geocoder_processor'
include GeocoderProcessor

namespace :recycle_bin do
  desc "Parse recycle bin pdf document provided by fehd.gov.hk"
  task :parse_location => :environment do
    districts = District.all
    raise "no district exists. please run db:seed to create the default districts." if districts.empty?

    cleanup_data
    
    [:hk, :kln, :nt, :is].each { |prefix|
      Dir["doc/fehd.gov.hk/#{prefix}_*.txt"].each {|entry|
        DistrictParser.parse(districts_by_prefix(districts, prefix), entry)
      }
    }
  end

  desc "Translate subdistrict address into latitude and longitude using Google Geocoder V3"
  task :geocode_subdistricts => :environment do
    (Subdistrict.find :all).each do |subdistrict|
      GeocoderProcessor.update_subdistrict_latlng(subdistrict)
    end
  end
  
  desc "Translate address into latitude and longitude using Google Geocoder V3"
  task :geocode_recycle_bins => :environment do
    (RecycleBin.find :all).each do |recycle_bin|
      GeocoderProcessor.update_recycle_bin_latlng(recycle_bin)
    end
  end
end

# i dont want to store the short prefix name into db ...
# meaningless to other modules
def districts_by_prefix(districts, prefix)
  name_eng = case prefix
  when :hk
    "Hong Kong Island"
  when :kln
    "Kowloon"
  when :nt
    "New Territories"
  when :is
    "Islands"
  else
    nil
  end
  
  districts.select{|district| district.name_eng == name_eng}.first if name_eng
end

def cleanup_data
  Subdistrict.destroy_all
  RecycleBin.destroy_all
end