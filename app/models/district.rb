class District
  include Mongoid::Document
  
  cache
  
  field :name, :type => String
  field :name_eng, :type => String
  
  attr_accessible :name, :name_eng
  
  validates_format_of :name_eng, :with => /[A-Za-z0-9,\-\(\)\.]/
  
  # index :name_eng, :background => true
  references_many :subdistricts
end
