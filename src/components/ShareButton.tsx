import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon, FacebookIcon } from '@/components/BrandIcons';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  menuWidth?: 'sm' | 'md' | 'lg';
}

export function ShareButton({ url, title, description, className = '', iconSize = 'md', menuWidth = 'lg' }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith('http') ? url : `https://www.shikshaq.in${url}`;
  const shareText = description 
    ? `${title} - ${description}`
    : `Check out ${title} on ShikshAq`;

  const copyToClipboard = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      // Clear any existing text selection
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
      
      // Use clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Try fallback method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowMenu(false);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    }
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    setShowMenu(false);
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out ${title} on ShikshAq`);
    const body = encodeURIComponent(`${shareText}\n\n${fullUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || shareText,
          url: fullUrl,
        });
        setShowMenu(false);
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Try native share first on mobile devices
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      await handleNativeShare();
    } else {
      setShowMenu(!showMenu);
    }
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const menuWidthClasses = {
    sm: 'w-44',
    md: 'w-48',
    lg: 'w-56',
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleShareClick}
        className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
        aria-label="Share"
      >
        <Share2 className={`${iconSizeClasses[iconSize]} text-foreground/70 hover:text-foreground transition-colors`} />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div 
            className={`absolute right-0 top-full mt-2 ${menuWidthClasses[menuWidth]} bg-card border border-border rounded-lg shadow-lg z-50 p-2 select-none`}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
          >
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 select-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyToClipboard(e);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy link
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={shareViaWhatsApp}
              >
                <WhatsAppIcon className="w-4 h-4" />
                Share via WhatsApp
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={shareViaFacebook}
              >
                <FacebookIcon className="w-4 h-4" />
                Share on Facebook
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={shareViaTwitter}
              >
                <Twitter className="w-4 h-4" />
                Share on Twitter
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={shareViaEmail}
              >
                <Mail className="w-4 h-4" />
                Share via Email
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

