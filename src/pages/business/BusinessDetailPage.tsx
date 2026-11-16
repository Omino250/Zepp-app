import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Product } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber, formatKes } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { Modal } from '../../components/common/Modal';
import { PostCard } from '../../components/cards/PostCard';

export const BusinessDetailPage: React.FC = () => {
  const { businessId } = useParams();
  const {
    businesses,
    posts,
    toggleFollowBusiness,
    sendBusinessEnquiry,
  } = useZepp();

  const business = businesses.find((b) => b.id === businessId);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');

  if (!business) {
    return (
      <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
        <h1 className="text-lg font-bold text-[#142443] dark:text-[#F0F5FF]">
          Business profile not found
        </h1>
        <Link
          to="/businesses"
          className="inline-block px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  const businessPosts = posts.filter(
    (p) => p.businessId === business.id || p.authorId === business.ownerId
  );

  const openEnquiryFor = (product?: Product) => {
    setEnquiryProduct(product || null);
    setEnquiryMessage(
      product
        ? `Hello ${business.name}, I would like to enquire about ${product.name} (${formatKes(
            product.priceKes
          )}).`
        : `Hello ${business.name}, I have a question regarding your products/services.`
    );
    setEnquiryOpen(true);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryMessage.trim()) return;
    sendBusinessEnquiry({
      businessId: business.id,
      productId: enquiryProduct?.id,
      message: enquiryMessage.trim(),
    });
    setEnquiryOpen(false);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/businesses"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Kenyan Businesses
      </Link>

      {/* Profile Header */}
      <section className="zepp-glass rounded-3xl overflow-hidden">
        <ZeppMedia
          src={business.coverUrl}
          alt={business.name}
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex items-end gap-4">
              <ZeppMedia
                src={business.logoUrl}
                alt={business.name}
                className="w-20 h-20 rounded-3xl object-cover border-4 border-white dark:border-[#142443] shadow-lg shrink-0 bg-white"
              />
              <div className="pt-8 sm:pt-0">
                <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
                  {business.name}
                </h1>
                <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                  {business.category} · {business.demoStatusNote}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => toggleFollowBusiness(business.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  business.isFollowing ? 'zepp-btn-secondary' : 'zepp-btn-primary'
                }`}
              >
                {business.isFollowing ? 'Following' : 'Follow Business'}
              </button>
              <button
                type="button"
                onClick={() => openEnquiryFor()}
                className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-[#1769E8]" />
                Enquire
              </button>
            </div>
          </div>

          <p className="text-sm text-[#1C2B45] dark:text-[#E5EEFF] leading-relaxed">
            {business.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs text-[#71819C] dark:text-[#A6B6D0]">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1769E8] shrink-0" />
              {business.address}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#1769E8] shrink-0" />
              {business.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1769E8] shrink-0" />
              {business.email}
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1769E8] shrink-0" />
              {business.website.replace('https://', '')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] pt-1">
            <span className="flex items-center gap-1.5 tabular-nums">
              <Users className="w-4 h-4 text-[#1769E8]" />
              {formatCompactNumber(business.followersCount)} Followers
            </span>
            <span className="flex items-center gap-1.5 tabular-nums">
              <ShoppingBag className="w-4 h-4 text-[#1769E8]" />
              {business.products.length} Products & Services
            </span>
          </div>
        </div>
      </section>

      {/* Products & Services */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
          Products & Services (KES)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {business.products.map((prod) => (
            <div
              key={prod.id}
              className="zepp-glass rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <ZeppMedia
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                      {prod.name}
                    </h3>
                    <span className="font-mono-num text-sm font-extrabold text-[#1769E8] dark:text-[#60A5FA] shrink-0">
                      {formatKes(prod.priceKes)}
                    </span>
                  </div>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                    {prod.category} · {business.name}
                  </p>
                  <p className="text-xs text-[#1C2B45] dark:text-[#DCEAFF] leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => openEnquiryFor(prod)}
                  className="w-full py-2.5 px-4 rounded-xl zepp-btn-primary text-xs font-bold"
                >
                  Send Product Enquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional & Business Posts */}
      {businessPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
            Promotions & Updates
          </h2>
          <div className="space-y-4">
            {businessPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Modal */}
      <Modal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        title={`Enquire with ${business.name}`}
        subtitle={
          enquiryProduct
            ? `Regarding: ${enquiryProduct.name} (${formatKes(enquiryProduct.priceKes)})`
            : 'Demo enquiry inbox'
        }
      >
        <form onSubmit={handleSubmitEnquiry} className="space-y-4">
          <textarea
            rows={4}
            value={enquiryMessage}
            onChange={(e) => setEnquiryMessage(e.target.value)}
            className="w-full zepp-neu-input rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
          />
          <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0]">
            Enquiries are logged locally in this prototype and visible inside the Business Dashboard.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEnquiryOpen(false)}
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
