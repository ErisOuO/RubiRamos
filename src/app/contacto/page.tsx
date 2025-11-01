import { Metadata } from 'next';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contacto',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visítanos en nuestra sucursal o contáctanos para obtener más información sobre nuestros autos seminuevos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mr-2" />
              Información de Contacto
            </h2>
            
            <div className="space-y-6">
           
              <div className="flex items-start space-x-4">
                <MapPinIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Carretera Huejutla - Chalahuiyapa Km. 6.1<br />
                    Col. Tepoxtequito<br />
                    Huejutla de Reyes, Hidalgo<br />
                    C.P. 43000, México
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <PhoneIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Teléfonos</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600 text-lg">
                      <a href="tel:+527821234567" className="hover:text-blue-600 transition-colors">
                        (782) 123-4567
                      </a>
                    </p>
                    <p className="text-gray-600 text-lg">
                      <a href="tel:+527821234568" className="hover:text-blue-600 transition-colors">
                        (782) 123-4568
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600 text-lg">
                      <a href="mailto:contacto@autoclick.com.mx" className="hover:text-blue-600 transition-colors">
                        Autoclick@2025.com.mx
                      </a>
                    </p>
                    
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <ClockIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horarios de Atención</h3>
                  <div className="text-gray-600 space-y-1">
                    <p className="text-lg">
                      <span className="font-medium">Lunes a Viernes:</span> 9:00 AM - 7:00 PM
                    </p>
                    <p className="text-lg">
                      <span className="font-medium">Sábados:</span> 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-lg">
                      <span className="font-medium">Domingos:</span> 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MapPinIcon className="w-6 h-6 text-blue-600 mr-2" />
                Nuestra Ubicación
              </h2>
            </div>
            

            <div className="relative h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.8974!2d-98.3836778!3d21.1559307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d72419f5e20d89%3A0x8c724b6d4181f3c8!2sUniversidad%20Tecnol%C3%B3gica%20de%20la%20Huasteca%20Hidalguense!5e0!3m2!1ses!2smx!4v1623456789012!5m2!1ses!2smx"
                width="100%"
                height="100%"
                className="iframe-borderless"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Autoclick"
              ></iframe>
            </div>
            
            <div className="p-6 bg-gray-50">
              <a
                href="https://www.google.com/maps/place/Universidad+Tecnol%C3%B3gica+de+la+Huasteca+Hidalguense/@21.1559307,-98.3836778,17z/data=!3m1!4b1!4m6!3m5!1s0x85d72419f5e20d89:0x8c724b6d4181f3c8!8m2!3d21.1559307!4d-98.3811029!16s%2Fg%2F11h7q4m8vv?hl=es&entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-lg"
              >
                <MapPinIcon className="w-5 h-5 mr-2" />
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}